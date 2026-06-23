using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Services;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace ChepuPizza.BLL
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusinessLogic(this IServiceCollection services)
        {
            services.AddScoped<IPizzaService, PizzaService>();
            services.AddScoped<IIngredientService, IngredientService>();
            services.AddScoped<IPizzaBuilderService, PizzaBuilderService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IManagerOrdersService, ManagerOrdersService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtService, JwtService>();

            services.AddScoped<IPizzaRepository, PizzaRepository>();
            services.AddScoped<IIngredientRepository, IngredientRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IManagerOrdersRepository, ManagerOrdersRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
