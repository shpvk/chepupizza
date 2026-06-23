namespace ChepuPizza.BLL.DTO
{
    public class PizzaResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; } = 0;
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int OrderCount { get; set; }
        public List<IngredientResponse> Ingredients { get; set; } = new();
    }
}

