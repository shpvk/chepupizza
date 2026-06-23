using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Mappings;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Services
{
    public class PizzaService : IPizzaService
    {
        private readonly IPizzaRepository _pizzaRepository;

        public PizzaService(IPizzaRepository pizzaRepository)
        {
            _pizzaRepository = pizzaRepository;
        }

        public async Task<List<PizzaResponse>> GetAllAsync()
        {
            List<Pizza> pizzas = await _pizzaRepository.GetAllAsync();
            return pizzas.Select(pizza => pizza.ToResponse()).ToList();
        }

        public async Task<PizzaResponse> GetByIdAsync(int pizzaId)
        {
            Pizza? pizza = await _pizzaRepository.GetByIdAsync(pizzaId);

            if (pizza == null)
            {
                throw new Exception("Pizza not found");
            }

            return pizza.ToResponse();
        }

        public async Task<PizzaResponse> CreateAsync(PizzaRequest pizzaRequest)
        {
            if (pizzaRequest.IngredientIds == null || pizzaRequest.IngredientIds.Count <= 0)
            {
                throw new ArgumentException("Pizza must have at least one ingredient");
            }

            if (!Enum.TryParse(pizzaRequest.Category, ignoreCase: true, out PizzaCategory category))
            {
                throw new ArgumentException("Invalid pizza category");
            }

            (Pizza? pizza, string? error) = Pizza.Create(
                pizzaRequest.Name,
                pizzaRequest.Price,
                pizzaRequest.ImageUrl,
                category);

            if (error != null)
            {
                throw new Exception(error);
            }

            if (pizza == null)
            {
                throw new Exception("Pizza creation failed");
            }

            foreach (int ingredientId in pizzaRequest.IngredientIds.Distinct())
            {
                pizza.AddIngredientById(ingredientId);
            }

            Pizza responsePizza = await _pizzaRepository.AddAsync(pizza);
            return responsePizza.ToResponse();
        }
    }
}
