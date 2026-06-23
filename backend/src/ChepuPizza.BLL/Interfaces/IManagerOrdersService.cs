using ChepuPizza.BLL.DTO;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IManagerOrdersService
    {
        Task<List<OrderResponse>> GetAllAsync(string? status);

        Task<OrderResponse> AcceptAsync(int orderId);

        Task<OrderResponse> CancelAsync(int orderId);
    }
}
