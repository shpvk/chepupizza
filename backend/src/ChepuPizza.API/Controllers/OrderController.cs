using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChepuPizza.API.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }


        [HttpPost]
        public async Task<IActionResult> Create(OrderRequest orderRequest)
        {
            try
            {
                var createdOrder = await _orderService.CreateAsync(orderRequest);
                return Ok(createdOrder);
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Failed to create order");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create order");
            }
        }
    }
}
