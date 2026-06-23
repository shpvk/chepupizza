using ChepuPizza.BLL.DTO;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IPizzaBuilderService
    {
        Task<PizzaBuilderResponse> CalculateAsync(PizzaBuilderRequest request);
    }
}
