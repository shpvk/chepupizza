using ChepuPizza.DAL.Data;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChepuPizza.DAL.Repositories
{
    public class PizzaRepository : IPizzaRepository
    {
        private readonly AppDbContext _context;

        public PizzaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Pizza>> GetAllAsync()
        {
            List<Pizza> pizzas = await _context.Pizzas
                .AsNoTracking()
                .Include(p => p.PizzaIngredients)
                    .ThenInclude(pi => pi.Ingredient)
                .AsSplitQuery()
                .ToListAsync();


            return pizzas;
        }

        public async Task<Pizza?> GetByIdAsync(int pizzaId)
        {
            Pizza? pizza = await _context.Pizzas
                .AsNoTracking()
                .Include(p => p.PizzaIngredients)
                    .ThenInclude(pi => pi.Ingredient)
                .AsSplitQuery()
                .FirstOrDefaultAsync(p => p.Id == pizzaId);

            if (pizza == null)
            {
                return null;
            }
            return pizza;
        }

        public async Task<Pizza> AddAsync(Pizza pizza)
        {
            await _context.Pizzas.AddAsync(pizza);
            await _context.SaveChangesAsync();
            return pizza;
        }
    }
}
