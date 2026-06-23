using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChepuPizza.API.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController
    {
        public readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        //[HttpPost]
        //public async Task<IActionResult> Create(CartRequest cartRequest)
        //{
        //    var cart = await _cartService.CreateAsync(cartRequest);
        //    return Ok(cart);
        //}
    }
}
