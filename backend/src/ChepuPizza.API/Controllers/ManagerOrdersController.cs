using ChepuPizza.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChepuPizza.API.Controllers
{
    [ApiController]
    [Route("api/manager/orders")]
    public class ManagerOrdersController : ControllerBase
    {
        private readonly IManagerOrdersService _managerOrdersService;

        public ManagerOrdersController(IManagerOrdersService managerOrdersService)
        {
            _managerOrdersService = managerOrdersService;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] string? status)
        {
            return StatusCode(
                StatusCodes.Status501NotImplemented,
                "Manager orders list endpoint is not implemented yet.");
        }

        [HttpPatch("{orderId:int}/accept")]
        public IActionResult Accept(int orderId)
        {
            return StatusCode(
                StatusCodes.Status501NotImplemented,
                "Accept order endpoint is not implemented yet.");
        }

        [HttpPatch("{orderId:int}/cancel")]
        public IActionResult Cancel(int orderId)
        {
            return StatusCode(
                StatusCodes.Status501NotImplemented,
                "Cancel order endpoint is not implemented yet.");
        }
    }
}
