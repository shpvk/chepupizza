# ChepuPizza Backend

Backend for a pizza ordering and pizza builder application built with ASP.NET Core Web API.

## Features

* Pizza catalog
* Ingredient catalog
* Custom pizza builder
* Order creation
* User registration and login
* JWT authentication
* Price calculation based on selected ingredients
* PostgreSQL database
* Entity Framework Core
* Swagger/OpenAPI documentation
* Supabase Storage integration for ingredient images

---

## Architecture

The project follows a classic 3-layer architecture:

```txt
ChepuPizza.API
        ↓
ChepuPizza.BLL
        ↓
ChepuPizza.DAL
        ↓
PostgreSQL (Supabase)
```

## API Endpoints

### Authentication

Register user:

```http
POST /api/Auth/register
```

Login user:

```http
POST /api/Auth/login
```

---

### Ingredients

Get all ingredients:

```http
GET /api/ingredients
```

Get ingredient by id:

```http
GET /api/ingredients/{ingredientId}
```

---

### Orders

Create order:

```http
POST /api/order
```

---

### Pizzas

Get all pizzas:

```http
GET /api/pizzas
```

Create pizza:

```http
POST /api/pizzas
```

Get pizza by id:

```http
GET /api/pizzas/{pizzaId}
```

---

### Pizza Builder

Calculate custom pizza price without saving it.

```http
POST /api/pizzas/calculate
```

## Request Flow

Example:

```txt
Client
  ↓
OrderController
  ↓
OrderService
  ↓
OrderRepository
  ↓
AppDbContext
  ↓
PostgreSQL
```

---

## Technologies

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* LINQ
* Dependency Injection
* JWT Authentication

### Database

* Supabase PostgreSQL

### Storage

Ingredient images are stored in Supabase Storage.

Stored data:

* Users
* Pizzas
* Ingredients
* PizzaIngredients
* Orders
* OrderItems

---

## Future Improvements

* Refresh Tokens
* Role-Based Authorization
* Unit Tests
* Docker Support
* Admin Panel

---

Project created for learning ASP.NET Core Web API, Entity Framework Core, PostgreSQL, JWT authentication, and software architecture principles.
