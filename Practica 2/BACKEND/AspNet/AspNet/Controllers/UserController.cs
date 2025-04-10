using AspNet.Data;
using AspNet.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using AspNet.DTOs;

namespace AspNet.Controllers
{
    [Route("api/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("auth/register")]
        public async Task<IActionResult> CreateUser([FromBody] UserRegisterDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.Password);

            var usuario = new User
            {
                Username = userDTO.Username,
                Email = userDTO.Email,
                Password = hashedPassword,
            };

            _context.Users.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new {Message = "User created successfully", user = usuario});
        }

        [HttpPost("auth/login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }
            try
            {
                var usuario = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
                if (usuario == null)
                    return Unauthorized(new { Message = "Credenciales invalidas" });

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, usuario.Password);

                if (!isPasswordValid)
                    return Unauthorized(new { Message = "Credenciales invalidas" });

                return Ok(new { Message = "Inicio de sesion exitoso", data = usuario, error = false });
            }catch(Exception ex)
            {
                return StatusCode(500, $"Error Interno: { ex.Message}");
            }
        }

        [HttpPost("auth/profile_picture/{id}")]
        public async Task<IActionResult> updatePhoto(int id, [FromBody] UpdatePhotoDTO model)
        {
            try
            {
                var usuario = await _context.Users.FindAsync(id);
                if (usuario == null)
                    return BadRequest(new {Message = "Usuario no encontrado"});
                usuario.ProfilePictureUrl = model.Profile_picture_url;

                await _context.SaveChangesAsync(); 
                
                return Ok(new {Message = "Foto de perfil actualizada"});
            }catch(Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }
    }
}
