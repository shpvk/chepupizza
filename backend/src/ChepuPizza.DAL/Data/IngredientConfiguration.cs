using ChepuPizza.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChepuPizza.DAL.Data
{
    public class IngredientConfiguration : IEntityTypeConfiguration<Ingredient>
    {
        public void Configure(EntityTypeBuilder<Ingredient> builder)
        {
            builder.ToTable("Ingredients");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Price)
                .IsRequired()
                .HasColumnType("decimal(10,2)");

            builder.Property(x => x.IsAvailable)
                .IsRequired();

            builder.Property(x => x.ImageUrl)
                .IsRequired();

            builder.Property(x => x.Category)
                .HasConversion<string>()
                .IsRequired();
        }
    }
}