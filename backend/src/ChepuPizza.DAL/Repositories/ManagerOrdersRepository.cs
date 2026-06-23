using ChepuPizza.DAL.Data;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.DAL.Repositories
{
    public class ManagerOrdersRepository : IManagerOrdersRepository
    {
        private readonly AppDbContext _context;

        public ManagerOrdersRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<Order>> GetAllAsync(OrderStatus? status)
        {
            throw new NotImplementedException();
        }

        public Task<Order> AcceptAsync(int orderId)
        {
            throw new NotImplementedException();
        }

        public Task<Order> CancelAsync(int orderId)
        {
            throw new NotImplementedException();
        }
    }
}
