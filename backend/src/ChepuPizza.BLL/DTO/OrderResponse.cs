namespace ChepuPizza.BLL.DTO
{
    public class OrderResponse
    {
        public int Id { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public decimal TotalPrice { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public List<OrderItemResponse> Items { get; set; } = new();
    }

    public class OrderItemResponse
    {
        public int Id { get; set; }

        public string PizzaName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public List<IngredientResponse> Ingredients { get; set; } = new();
    }
}
