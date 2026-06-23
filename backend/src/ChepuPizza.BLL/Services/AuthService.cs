using ChepuPizza.BLL.DTO;
using ChepuPizza.BLL.Interfaces;
using ChepuPizza.DAL.Interfaces;
using ChepuPizza.DAL.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace ChepuPizza.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        public AuthService(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterUserRequest request)
        {
            (User? user, string? error) = User.Create(request.Username, request.Password);
            if (user == null)
            {
                throw new Exception(error);
            }

            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);

            user.SetPasswordHash(hashedPassword);
            user = await _userRepository.CreateAsync(user);

            string token = _jwtService.CreateToken(user);

            AuthResponse response = new AuthResponse
            {
                Username = user.Username,
                Id = user.Id,
                Token = token
            };

            return response;
        }

        public async Task<AuthResponse?> LoginAsync(LoginUserRequest request)
        {
            User? user = await _userRepository.GetByUsernameAsync(request.Username);
            if(user == null)
            {
                return null;
            }

            if(new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
            {
                return null;
            }

            string token = _jwtService.CreateToken(user);

            AuthResponse response = new AuthResponse
            {
                Id = user.Id,
                Username = user.Username,
                Token = token
            };

            return response;
        }
    }
}
