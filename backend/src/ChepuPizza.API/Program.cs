using ChepuPizza.BLL;
using ChepuPizza.DAL;

namespace ChepuPizza.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

            builder.Services.AddBusinessLogic();
            builder.Services.AddDatabase(builder.Configuration);

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy.WithOrigins(
                        "https://chepupizzeria.vercel.app",
                        "https://chepupizza.vercel.app",
                        "http://localhost:5173"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            builder.Services.AddMemoryCache();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            //app.MapGet("/", () => Results.Redirect("/swagger"));

            app.UseCors("Frontend");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
