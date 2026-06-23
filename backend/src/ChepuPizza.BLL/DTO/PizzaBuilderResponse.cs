namespace ChepuPizza.BLL.DTO
{
    public class PizzaBuilderResponse
    {
        public decimal TotalPrice { get; set; }
        public List<IngredientResponse> Ingredients { get; set; } = new();
    }
}
