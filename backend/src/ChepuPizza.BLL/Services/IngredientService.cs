using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Mappings;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Services
{
    public class IngredientService : IIngredientService
    {
        private readonly IIngredientRepository _ingredientRepository;

        public IngredientService(IIngredientRepository ingredientRepository)
        {
            _ingredientRepository = ingredientRepository;
        }

        public async Task<List<IngredientResponse>> GetAllAsync()
        {
            List<Ingredient> ingredients = await _ingredientRepository.GetAllAsync();
            return ingredients.Select(ingredient => ingredient.ToResponse()).ToList();
        }

        public async Task<IngredientResponse?> GetByIdAsync(int ingredientId)
        {
            Ingredient? ingredient = await _ingredientRepository.GetByIdAsync(ingredientId);
            return ingredient?.ToResponse();
        }
    }
}
