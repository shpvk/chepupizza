using ChepuPizza.BLL.DTO;

namespace ChepuPizza.BLL.Interfaces
{
    public interface ICartService
    {
        Task<CartResponse> CreateAsync(CartRequest cartRequest);
    }
}
