using AspNet.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNet.Controllers
{
    [Route("api/")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("files/{id}/upload")]
        public async Task<IActionResult> CreateFile(int id, [FromBody] Models.File model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var usuario = await _context.Users.FindAsync(id);
                if (usuario == null)
                    return NotFound(new { Message = "Usuario no encontrado" });
                var newFile = new Models.File
                {
                    Url = model.Url,
                    UserId = usuario.Id,
                    User = usuario
                };
                _context.Files.Add(newFile);
                await _context.SaveChangesAsync();
                return Ok(new {Message = "Libro creado exitosamente"});
            }catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpGet("files/{id}")]
        public async Task<ActionResult<IEnumerable<Models.File>>> GetFilesId(int id)
        {
            try
            {
                var files = await _context.Files
                    .Where(f => f.UserId == id)
                    .ToListAsync();

                if(files == null || !files.Any())
                {
                    return NotFound(new { Message = "Este usuario no cuenta con archivos" });
                }
                return Ok(files);

            }catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }
    }
}
