namespace ChepuPizza.DAL.Models.Entities
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string ImageUrl { get; set; } = string.Empty;
        public IngredientCategory Category { get; set; }
    }
    public enum IngredientCategory
    {
        Sausage = 1,
        Mushroom = 2,
        Cheese = 3,
        Sauce = 4,
        Dough = 5
    }
}
