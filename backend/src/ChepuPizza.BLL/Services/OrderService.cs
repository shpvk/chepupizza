using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Mappings;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IPizzaRepository _pizzaRepository;
        private readonly IIngredientRepository _ingredientRepository;

        public OrderService(
            IOrderRepository orderRepository,
            IPizzaRepository pizzaRepository,
            IIngredientRepository ingredientRepository)
        {
            _orderRepository = orderRepository;
            _pizzaRepository = pizzaRepository;
            _ingredientRepository = ingredientRepository;
        }

        public async Task<OrderResponse> CreateAsync(OrderRequest requestDto)
        {
            if (requestDto.Items == null || requestDto.Items.Count == 0)
            {
                throw new ArgumentException("Order must contain at least one item");
            }

            List<OrderItem> orderItems = new();

            foreach (OrderItemRequest itemDto in requestDto.Items)
            {
                if (itemDto.Quantity <= 0)
                {
                    throw new ArgumentException("Quantity must be more than zero");
                }

                OrderItem orderItem = itemDto.PizzaId.HasValue
                    ? await CreateMenuPizzaOrderItemAsync(itemDto)
                    : await CreateCustomPizzaOrderItemAsync(itemDto);

                orderItems.Add(orderItem);
            }

            (Order? order, string? error) = Order.Create(
                requestDto.CustomerName,
                requestDto.Phone,
                requestDto.Address,
                requestDto.Comment,
                orderItems
            );

            if (error != null)
            {
                throw new ArgumentException(error);
            }

            await _orderRepository.CreateAsync(order!);
            return order!.ToResponse();
        }

        private async Task<OrderItem> CreateMenuPizzaOrderItemAsync(OrderItemRequest itemDto)
        {
            Pizza? pizza = await _pizzaRepository.GetByIdAsync(itemDto.PizzaId!.Value);

            if (pizza == null)
            {
                throw new ArgumentException("Pizza not found");
            }

            List<Ingredient> ingredients = pizza.PizzaIngredients
                .Select(pizzaIngredient => pizzaIngredient.Ingredient)
                .ToList();

            List<int> additionalIngredientIds = itemDto.IngredientIds?
                .Where(ingredientId => ingredientId > 0)
                .ToList() ?? new();

            if (additionalIngredientIds.Count > 0)
            {
                List<int> uniqueAdditionalIngredientIds = additionalIngredientIds.Distinct().ToList();
                List<Ingredient> availableAdditionalIngredients = await _ingredientRepository.GetByIdsAsync(uniqueAdditionalIngredientIds);

                if (availableAdditionalIngredients.Count != uniqueAdditionalIngredientIds.Count)
                {
                    throw new ArgumentException("Some ingredients were not found");
                }

                Dictionary<int, Ingredient> ingredientsById = availableAdditionalIngredients
                    .ToDictionary(ingredient => ingredient.Id);

                List<Ingredient> addedIngredients = additionalIngredientIds
                    .Select(ingredientId => ingredientsById[ingredientId])
                    .ToList();

                List<Ingredient> customIngredients = ingredients
                    .Concat(addedIngredients)
                    .ToList();

                (OrderItem? customOrderItem, string? customError) = OrderItem.Create(
                    $"Custom {pizza.Name}",
                    null,
                    itemDto.Quantity,
                    pizza.Price + addedIngredients.Sum(ingredient => ingredient.Price),
                    customIngredients);

                if (customOrderItem == null)
                {
                    throw new ArgumentException(customError);
                }

                return customOrderItem;
            }

            (OrderItem? orderItem, string? error) = OrderItem.Create(
                pizza.Name,
                pizza.Id,
                itemDto.Quantity,
                pizza.Price,
                ingredients);

            if (orderItem == null)
            {
                throw new ArgumentException(error);
            }

            pizza.IncreaseOrderCount(itemDto.Quantity);
            return orderItem;
        }

        private async Task<OrderItem> CreateCustomPizzaOrderItemAsync(OrderItemRequest itemDto)
        {
            List<int> ingredientIds = itemDto.IngredientIds?
                .Where(ingredientId => ingredientId > 0)
                .Distinct()
                .ToList() ?? new();

            if (ingredientIds.Count == 0)
            {
                throw new ArgumentException("Custom pizza must contain at least one ingredient");
            }

            List<Ingredient> ingredients = await _ingredientRepository.GetByIdsAsync(ingredientIds);

            if (ingredients.Count != ingredientIds.Count)
            {
                throw new ArgumentException("Some ingredients were not found");
            }

            (OrderItem? orderItem, string? error) = OrderItem.Create(
                "Custom Pizza",
                null,
                itemDto.Quantity,
                ingredients.Sum(ingredient => ingredient.Price),
                ingredients);

            if (orderItem == null)
            {
                throw new ArgumentException(error);
            }

            return orderItem;
        }
    }
}
