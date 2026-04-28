using Microsoft.AspNetCore.Mvc;

namespace TradingTerminal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TradingController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "ok", time = DateTime.UtcNow });
    }
}
