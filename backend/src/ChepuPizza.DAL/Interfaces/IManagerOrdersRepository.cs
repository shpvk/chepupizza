using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.DAL.Interfaces
{
    public interface IManagerOrdersRepository
    {
        Task<List<Order>> GetAllAsync(OrderStatus? status);

        Task<Order> AcceptAsync(int orderId);

        Task<Order> CancelAsync(int orderId);
    }
}
