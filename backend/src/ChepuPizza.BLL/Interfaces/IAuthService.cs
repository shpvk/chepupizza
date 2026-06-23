using ChepuPizza.BLL.DTO;

namespace ChepuPizza.BLL.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterUserRequest request);
        Task<AuthResponse?> LoginAsync(LoginUserRequest request);
    }
}
