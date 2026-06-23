using ChepuPizza.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChepuPizza.API.Controllers
{
    [ApiController]
    [Route("api/ingredients")]
    public class IngredientController : ControllerBase
    {
        public readonly IIngredientService _ingredientService;

        public IngredientController(IIngredientService cheeseService)
        {
            _ingredientService = cheeseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ingredients = await _ingredientService.GetAllAsync();
            return Ok(ingredients);
        }

        [HttpGet("{ingredientId:int}")]
        public async Task<IActionResult> GetById(int ingredientId)
        {
            var ingredient = await _ingredientService.GetByIdAsync(ingredientId);

            if(ingredient == null)
            {
                return NotFound();
            }

            return Ok(ingredient);
        }
    }
}
