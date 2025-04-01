using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AspNet.Controllers
{
    [Route("/")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult VerificarDisponibilidad()
        {
            return Ok(new {Message = "API disponible", StatusCode = 200});
        }
    }
}
