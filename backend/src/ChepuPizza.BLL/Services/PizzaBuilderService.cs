using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Mappings;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Services
{
    public class PizzaBuilderService : IPizzaBuilderService
    {
        private readonly IIngredientRepository _ingredientRepository;

        public PizzaBuilderService(IIngredientRepository ingredientRepository)
        {
            _ingredientRepository = ingredientRepository;
        }

        public async Task<PizzaBuilderResponse> CalculateAsync(PizzaBuilderRequest request)
        {
            if (request.IngredientIds.Count == 0)
            {
                throw new Exception("Choose at least one ingredient");
            }

            List<int> ingredientIds = request.IngredientIds.Distinct().ToList();
            List<Ingredient> ingredients = await _ingredientRepository.GetByIdsAsync(ingredientIds);

            if (ingredients.Count != ingredientIds.Count)
            {
                throw new ArgumentException("Some ingredients were not found");
            }

            return new PizzaBuilderResponse
            {
                Ingredients = ingredients.Select(ingredient => ingredient.ToResponse()).ToList(),
                TotalPrice = ingredients.Sum(ingredient => ingredient.Price)
            };
        }
    }
}
