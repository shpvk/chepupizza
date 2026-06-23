using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChepuPizza.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderCountToPizza : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ingredients_OrderItems_OrderItemId",
                table: "Ingredients");

            migrationBuilder.DropIndex(
                name: "IX_Ingredients_OrderItemId",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "OrderItemId",
                table: "Ingredients");

            migrationBuilder.AddColumn<int>(
                name: "OrderCount",
                table: "Pizzas",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderCount",
                table: "Pizzas");

            migrationBuilder.AddColumn<int>(
                name: "OrderItemId",
                table: "Ingredients",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_OrderItemId",
                table: "Ingredients",
                column: "OrderItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredients_OrderItems_OrderItemId",
                table: "Ingredients",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id");
        }
    }
}
