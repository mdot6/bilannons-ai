using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace BilAnnonsAI.Api.Middleware;

/// <summary>
/// Fångar oväntade fel och svarar med samma problem+json-format som
/// valideringsfel. Loggar detaljerna på serversidan men skickar aldrig
/// stacktrace eller interna meddelanden till klienten.
/// </summary>
public class ExceptionHandler(ILogger<ExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(
            exception,
            "Ohanterat fel vid {Method} {Path}",
            context.Request.Method,
            context.Request.Path);

        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Ett oväntat fel inträffade.",
            Detail = "Försök igen om en stund. Om felet kvarstår, kontakta support.",
            Instance = context.Request.Path
        };

        context.Response.StatusCode = problem.Status.Value;
        await context.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
    }
}