using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.DAL.Interfaces
{
    public interface IIngredientRepository
    {
        Task<List<Ingredient>> GetAllAsync();
        Task<Ingredient?> GetByIdAsync(int ingredientId);
        Task<List<Ingredient>> GetByIdsAsync(List<int> ingredientIds);
    }
}
