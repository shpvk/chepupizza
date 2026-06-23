using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.BLL.Mappings;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Services
{
    public class ManagerOrdersService : IManagerOrdersService
    {
        private readonly IManagerOrdersRepository _managerOrdersRepository;

        public ManagerOrdersService(IManagerOrdersRepository managerOrdersRepository)
        {
            _managerOrdersRepository = managerOrdersRepository;
        }

        public async Task<List<OrderResponse>> GetAllAsync(string? status)
        {
            OrderStatus? orderStatus = null;

            if (!string.IsNullOrWhiteSpace(status))
            {
                if (!Enum.TryParse(status, ignoreCase: true, out OrderStatus parsedStatus))
                {
                    throw new ArgumentException("Invalid order status");
                }
                orderStatus = parsedStatus;
            }

            List<Order> orders = await _managerOrdersRepository.GetAllAsync(orderStatus);
            List<OrderResponse> responses = orders.Select(order => order.ToResponse()).ToList();
            return responses;
        }

        public async Task<OrderResponse> AcceptAsync(int orderId)
        {
            Order order = await _managerOrdersRepository.AcceptAsync(orderId);
            OrderResponse orderResponse = order.ToResponse();
            return orderResponse;
        }

        public async Task<OrderResponse> CancelAsync(int orderId)
        {
            Order order = await _managerOrdersRepository.CancelAsync(orderId);
            if(order == null)
            {
                throw new Exception("Order not found");
            }
            OrderResponse orderResponse = order.ToResponse();
            return orderResponse;
        }
    }
}
