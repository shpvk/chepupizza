using ChepuPizza.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChepuPizza.DAL.Data
{
    public class PizzaIngredientConfiguration : IEntityTypeConfiguration<PizzaIngredient>
    {
        public void Configure(EntityTypeBuilder<PizzaIngredient> builder)
        {
            builder.ToTable("PizzaIngredients");

            builder.HasKey(x => new { x.PizzaId, x.IngredientId });

            builder.HasOne(x => x.Pizza)
                .WithMany(x => x.PizzaIngredients)
                .HasForeignKey(x => x.PizzaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Ingredient)
                .WithMany()
                .HasForeignKey(x => x.IngredientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}