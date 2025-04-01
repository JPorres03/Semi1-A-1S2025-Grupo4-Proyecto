using AspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AspNet.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AspNet.Controllers
{
    [Route("api/")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TaskController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("task/{id}")]
        public async Task<ActionResult<IEnumerable<Models.Task>>> GetTaskUserID(int id)
        {
            var tareas = await _context.Tasks
                .Where(t => t.IdUser == id && t.Status == false)
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();
                
            if (tareas == null || !tareas.Any())
            {
                return NotFound(new { Message = "Este usuario no cuenta con tareas" });
            }
            return Ok(tareas);
        }

        [HttpPost("task/{id}/create")]
        public async Task<IActionResult> createTask(int id, [FromBody] Models.Task model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var usuario = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (usuario == null) 
                    return BadRequest(new {Message = "Usuario no encontrado"});

                var newTask = new Models.Task
                {
                    Title = model.Title,
                    Description = model.Description,
                    IdUserNavigation = usuario
                };

                _context.Tasks.Add(newTask);
                await _context.SaveChangesAsync();

                return Ok(new {Message = "Tarea creada exitosamente"});
            }catch(Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpPut("task/update/{idTask}")]
        public async Task<IActionResult> updateTask(int idTask, [FromBody] Models.Task model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var tarea = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == idTask);
                if (tarea == null)
                    return NotFound(new { Message = "No se encontro la tarea" });

                tarea.Title = model.Title;
                tarea.Description = model.Description;

                await _context.SaveChangesAsync();

                return Ok(new {Message = "Tarea actualizada correctamente"});   


            }catch(Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpPatch("task/complete/{id}")]
        public async Task<IActionResult> completeTask([FromRoute]int id)
        {
            try
            {
                var tarea = await _context.Tasks.FirstOrDefaultAsync(t =>t.Id == id);
                if (tarea == null)
                    return NotFound(new { Message = "No se encontro la tarea" });

                tarea.Status = true;

                await _context.SaveChangesAsync();

                return Ok(new { Message = "Tarea Completada" });

            }catch(Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpDelete("task/delete/{id}")]
        public async Task<IActionResult> deleteTask(int id)
        {
            try
            {
                var tarea = await _context.Tasks.FindAsync(id);
                if (tarea == null)
                    return NotFound(new { Message = "Tarea no encontrada" });
                _context.Tasks.Remove(tarea);
                await _context.SaveChangesAsync();

                return Ok(new {Message = "Se elimino la tarea correctamente"});
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }
    }
}
