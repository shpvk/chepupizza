using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.DAL.Interfaces
{
    public interface IPizzaRepository
    {
        Task<List<Pizza>> GetAllAsync();

        Task<Pizza?> GetByIdAsync(int pizzaId);

        Task<Pizza> AddAsync(Pizza pizza);
    }
}
