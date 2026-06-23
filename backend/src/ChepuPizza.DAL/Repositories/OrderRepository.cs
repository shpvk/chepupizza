using ChepuPizza.DAL.Data;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChepuPizza.DAL.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateAsync(Order order)
        {
            return await CreateAsync(order, new Dictionary<int, int>());
        }

        public async Task<Order> CreateAsync(Order order, IReadOnlyDictionary<int, int> pizzaOrderCounts)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            foreach ((int pizzaId, int quantity) in pizzaOrderCounts)
            {
                await _context.Pizzas
                    .Where(pizza => pizza.Id == pizzaId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(
                            pizza => pizza.OrderCount,
                            pizza => pizza.OrderCount + quantity));
            }

            await transaction.CommitAsync();

            return order;
        }
    }
}
