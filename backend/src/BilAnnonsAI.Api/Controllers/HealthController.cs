using Microsoft.AspNetCore.Mvc;

namespace BilAnnonsAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            utcTime = DateTime.UtcNow
        });
    }
}