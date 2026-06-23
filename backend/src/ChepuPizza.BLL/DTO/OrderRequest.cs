namespace ChepuPizza.BLL.DTO
{
    public class OrderRequest
    {
        public string CustomerName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string? Comment { get; set; }

        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int? PizzaId { get; set; }

        public List<int>? IngredientIds { get; set; }

        public int Quantity { get; set; }
    }
}
