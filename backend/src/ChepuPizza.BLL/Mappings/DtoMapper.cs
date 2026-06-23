using ChepuPizza.BLL.DTO;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Mappings
{
    internal static class DtoMapper
    {
        public static IngredientResponse ToResponse(this Ingredient ingredient)
        {
            return new IngredientResponse
            {
                Id = ingredient.Id,
                Name = ingredient.Name,
                Price = ingredient.Price,
                IsAvailable = ingredient.IsAvailable,
                Category = ingredient.Category.ToString(),
                ImageUrl = ingredient.ImageUrl
            };
        }

        public static PizzaResponse ToResponse(this Pizza pizza)
        {
            return new PizzaResponse
            {
                Id = pizza.Id,
                Name = pizza.Name,
                Price = pizza.Price,
                ImageUrl = pizza.ImageUrl,
                Category = pizza.Category.ToString(),
                OrderCount = pizza.OrderCount,
                Ingredients = pizza.PizzaIngredients
                    .Where(pizzaIngredient => pizzaIngredient.Ingredient != null)
                    .Select(pizzaIngredient => pizzaIngredient.Ingredient.ToResponse())
                    .ToList()
            };
        }

        public static OrderResponse ToResponse(this Order order)
        {
            return new OrderResponse
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                Phone = order.Phone,
                Address = order.Address,
                TotalPrice = order.TotalPrice,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(orderItem => new OrderItemResponse
                {
                    Id = orderItem.Id,
                    PizzaName = orderItem.PizzaName,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    TotalPrice = orderItem.TotalPrice,
                    Ingredients = orderItem.Ingredients
                        .Select(ingredient => ingredient.ToResponse())
                        .ToList()
                }).ToList()
            };
        }
    }
}
