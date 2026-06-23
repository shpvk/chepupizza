using ChepuPizza.DAL.Models.Entities;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IJwtService
    {
        string CreateToken(User user);
    }
}
