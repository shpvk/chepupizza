using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.DAL.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User?> GetByUsernameAsync(string username);
    }
}
