using ChepuPizza.DAL.Data;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChepuPizza.DAL.Repositories
{
    public class IngredientRepository : IIngredientRepository
    {
        private readonly AppDbContext _context;

        public IngredientRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ingredient>> GetAllAsync()
        {
            List<Ingredient> cheeses = await _context.Ingredients.ToListAsync();
            return cheeses;
        }

        public async Task<Ingredient?> GetByIdAsync(int ingredientId)
        {
            Ingredient? ingredient = await _context.Ingredients.FindAsync(ingredientId);
            if(ingredient == null)
            {
                return null;
            }
            return ingredient;
        }
        public async Task<List<Ingredient>> GetByIdsAsync(List<int> ingredientIds)
        {
            

            List<Ingredient> ingredients = await _context.Ingredients
                .Where(i => ingredientIds.Contains(i.Id) && i.IsAvailable)
                .ToListAsync();

            return ingredients;
        }
    }
}
