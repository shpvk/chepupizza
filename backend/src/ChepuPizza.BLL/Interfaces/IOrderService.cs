using ChepuPizza.BLL.DTO;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponse> CreateAsync(OrderRequest request);
    }
}
