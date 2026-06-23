using System.Runtime.InteropServices;

namespace ChepuPizza.DAL.Models.Entities
{
    public class User
    {
        private User(string username, string passwordHash)
        {
            Username = username;
            PasswordHash = passwordHash;
        }

        private User()
        {
            // Ef Core
        }
        public int Id { get; private set; }
        public string Username { get; private set; } = string.Empty;

        public string PasswordHash { get; private set; } = string.Empty;

        public string Role {get; private set; } = string.Empty;

        public static (User? user, string? error) Create(string username, string passwordHash)
        {
            if (string.IsNullOrEmpty(username))
            {
                return (null, "Username cannot be empty");
            }

            if (string.IsNullOrEmpty(passwordHash))
            {
                return (null, "Password hash cannot be empty");
            }

            User user = new User(username, passwordHash);
            return (user, null);
        }

        public void SetPasswordHash(string passwordHash)
        {
            PasswordHash = passwordHash;
        }
    }
}
