using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.DAL.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ChepuPizza.API.Controllers
{
    [ApiController]
    [Route("api/pizzas")]
    public class PizzaController : ControllerBase
    {
        public readonly IPizzaService _pizzaService;

        public PizzaController(IPizzaService pizzaService)
        {
            _pizzaService = pizzaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pizzas = await _pizzaService.GetAllAsync();
            return Ok(pizzas);
        }

        [HttpGet("{pizzaId:int}")]
        public async Task<IActionResult> GetById(int pizzaId)
        {
            var pizza = await _pizzaService.GetByIdAsync(pizzaId);
            return Ok(pizza);
        }

        [HttpPost]
        public async Task<IActionResult> Create(PizzaRequest pizzaRequest)
        {
            var createdPizza = await _pizzaService.CreateAsync(pizzaRequest);
            return Ok(createdPizza);
        }
    }
}
