using BilAnnonsAI.Api.Contracts;
using BilAnnonsAI.Api.Data;
using BilAnnonsAI.Api.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BilAnnonsAI.Api.Controllers;

[ApiController]
[Route("api/advertisements")]
public class AdvertisementsController(AppDbContext db) : ControllerBase
{
    /// <summary>Sparar biluppgifter och skapar ett annonsutkast.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(AdvertisementResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AdvertisementResponse>> Create(
        CreateAdvertisementRequest request,
        CancellationToken cancellationToken)
    {
        var advertisement = new Advertisement
        {
            Vehicle = request.ToVehicle()
        };

        db.Advertisements.Add(advertisement);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = advertisement.Id },
            advertisement.ToResponse());
    }

    /// <summary>Hämtar en annons med tillhörande biluppgifter.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(AdvertisementResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdvertisementResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var advertisement = await db.Advertisements
            .Include(a => a.Vehicle)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

        if (advertisement is null)
        {
            return NotFound();
        }

        return Ok(advertisement.ToResponse());
    }
}