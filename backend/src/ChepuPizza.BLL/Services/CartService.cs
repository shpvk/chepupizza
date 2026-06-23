using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Repositories;

namespace ChepuPizza.BLL.Services
{
    public class CartService //: ICartService
    {
        private readonly ICartRepository _cartRepository;
        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        //public async Task<CartResponse> CreateAsync(CartRequest cartRequest)
        //{
        //    _cartRepository.CreateAsync(cartRequest);
        //}

    }
}
