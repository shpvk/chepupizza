namespace ChepuPizza.DAL.Models.Entities
{
    public class Order
    {
        private Order() 
        {
            // For Ef core
        }
        //  Order order = new Order(customerName, phone, address, comment, createdAt, orderItems);
        private Order(string customerName, string phone, string address, string? comment,
            List<OrderItem> orderItems) 
        {
            CustomerName = customerName;
            Phone = phone;
            Address = address;
            Comment = comment;
            OrderItems = orderItems;
            TotalPrice = orderItems.Sum(orderItem => orderItem.TotalPrice);
            Status = OrderStatus.Created;
            CreatedAt = DateTime.UtcNow;
        }

        public int Id { get; private set; }
        public string CustomerName { get; private set; } = string.Empty;
        public string Phone { get; private set; } = null!;
        public string Address { get; private set; } = null!;
        public string? Comment { get; private set; } = string.Empty;
        public decimal TotalPrice { get; private set; }
        public OrderStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public List<OrderItem> OrderItems { get; private set; } = new();

        public static (Order? order, string? error) Create(string customerName, string phone, string address, 
            string? comment, List<OrderItem> orderItems)

        {
            if (string.IsNullOrWhiteSpace(customerName))
                return (null, "Customer name cannot be empty");

            if (string.IsNullOrWhiteSpace(phone))
                return (null, "Phone cannot be empty");

            if (string.IsNullOrWhiteSpace(address))
                return (null, "Address cannot be empty");

            if (orderItems == null || orderItems.Count == 0)
                return (null, "Order must contain at least one item");


            Order order = new Order(customerName, phone, address, comment, orderItems);
            return (order, null);
        }

        public void Accept()
        {
            if (Status != OrderStatus.Created)
            {
                throw new InvalidOperationException("Only created orders can be accepted");
            }
            Status = OrderStatus.Accepted;
        }
    }
    public class OrderItem
    {
        private OrderItem()
        {
            // For EF Core
        }

        private OrderItem(
            string pizzaName,
            int? pizzaId,
            int quantity,
            decimal unitPrice,
            List<Ingredient> ingredients)
        {
            PizzaName = pizzaName;
            PizzaId = pizzaId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            TotalPrice = unitPrice * quantity;
            Ingredients = ingredients;
        }

        public int Id { get; private set; }

        public int OrderId { get; private set; }
        public Order Order { get; private set; } = null!;

        public int? PizzaId { get; private set; }

        public string PizzaName { get; private set; } = string.Empty;

        public int Quantity { get; private set; }

        public decimal UnitPrice { get; private set; }

        public decimal TotalPrice { get; private set; }

        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public List<Ingredient> Ingredients { get; private set; } = new();


        public static (OrderItem? orderItem, string? error) Create(
            string pizzaName,
            int? pizzaId,
            int quantity,
            decimal unitPrice,
            List<Ingredient> ingredients)
        {
            if (string.IsNullOrWhiteSpace(pizzaName))
                return (null, "Pizza name cannot be empty");

            if (quantity <= 0)
                return (null, "Quantity must be greater than zero");

            if (unitPrice < 0)
                return (null, "Unit price cannot be lower than zero");

            if (!pizzaId.HasValue && (ingredients == null || ingredients.Count == 0))
                return (null, "Order item must contain at least one ingredient");

            OrderItem orderItem = new OrderItem(
                pizzaName,
                pizzaId,
                quantity,
                unitPrice,
                ingredients);

            return (orderItem, null);
        }
    }

    public enum OrderStatus
    {
        Created = 1,
        Accepted = 2,
        Cooking = 3,
        Ready = 4,
        Delivered = 5,
        Cancelled = 6
    }

}
