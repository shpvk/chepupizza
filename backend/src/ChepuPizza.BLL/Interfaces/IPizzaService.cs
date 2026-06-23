using ChepuPizza.BLL.DTO;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IPizzaService
    {
        Task<List<PizzaResponse>> GetAllAsync();
        Task<PizzaResponse> GetByIdAsync(int pizzaId);
        Task<PizzaResponse> CreateAsync(PizzaRequest pizzaRequest);
    }
}
