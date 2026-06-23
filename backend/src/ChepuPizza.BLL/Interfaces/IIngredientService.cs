using ChepuPizza.BLL.DTO;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IIngredientService
    {
        Task<List<IngredientResponse>> GetAllAsync();
        Task<IngredientResponse?> GetByIdAsync(int cheeseId);
    }
}
