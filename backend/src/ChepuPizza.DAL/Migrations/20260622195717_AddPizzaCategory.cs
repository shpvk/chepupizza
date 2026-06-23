using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChepuPizza.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddPizzaCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Pizzas",
                type: "text",
                nullable: false,
                defaultValue: "Veggie");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Pizzas");
        }
    }
}
