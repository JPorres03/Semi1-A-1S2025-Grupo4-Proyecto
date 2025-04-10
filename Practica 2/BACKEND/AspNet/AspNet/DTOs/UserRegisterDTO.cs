using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
namespace AspNet.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        [Compare("Password", ErrorMessage = "La contrasena no coinciden")]
        public string Confirm_password { get; set; } = null!;
    }
}
