using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChepuPizza.API.Controllers
{
    [ApiController]
    [Route("api/pizzas")]
    public class PizzaBuilderController : ControllerBase
    {
        public readonly IPizzaBuilderService _pizzaBuilderService;

        public PizzaBuilderController(IPizzaBuilderService pizzaBuilderService)
        {
            _pizzaBuilderService = pizzaBuilderService;
        }

        [HttpPost("calculate")]
        public async Task<IActionResult> Calculate(PizzaBuilderRequest request)
        {
            var result = await _pizzaBuilderService.CalculateAsync(request);
            return Ok(result);
        }
    }
}
