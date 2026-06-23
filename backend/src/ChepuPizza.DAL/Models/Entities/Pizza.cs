namespace ChepuPizza.DAL.Models.Entities
{
    public class Pizza
    {
        private Pizza()
        {
            // For EF Core
        }

        private Pizza(string name, decimal price, string imageUrl, PizzaCategory category)
        {
            Name = name;
            Price = price;
            ImageUrl = imageUrl;
            Category = category;
        }

        public int OrderCount { get; private set; }

        public int Id { get; private set; }

        public string Name { get; private set; } = string.Empty;

        public decimal Price { get; private set; }

        public string ImageUrl { get; private set; } = string.Empty;

        public PizzaCategory Category { get; private set; }

        public bool IsAvailable { get; private set; } = true;
        
        public List<PizzaIngredient> PizzaIngredients { get; private set; } = new();

        public static (Pizza? pizza, string? error) Create(
            string name,
            decimal price,
            string? imageUrl,
            PizzaCategory category)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return (null, "Name cannot be empty");
            }

            if (price < 0)
            {
                return (null, "Price cannot be lower than zero");
            }

            Pizza pizza = new Pizza(name, price, imageUrl ?? string.Empty, category);

            return (pizza, null);
        }
        public void AddIngredientById(int ingredientId)
        {
            PizzaIngredients.Add(new PizzaIngredient
            {
                IngredientId = ingredientId,
                Pizza = this
            });
        }

        public void IncreaseOrderCount(int quantity)
        {
            OrderCount += quantity;
        }
    }

    public class PizzaIngredient
    { 
        public int PizzaId { get; set; }
        public Pizza Pizza { get; set; } = null!;
        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; } = null!;
    }

    public enum PizzaCategory
    {
        Veggie = 1,
        Meat = 2,
        Mushrooms = 3,
        Seafood = 4
    }
}
