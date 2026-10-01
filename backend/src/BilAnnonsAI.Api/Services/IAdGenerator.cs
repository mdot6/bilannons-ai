using BilAnnonsAI.Api.Domain;

namespace BilAnnonsAI.Api.Services;

/// <summary>Resultatet av en annonsgenerering. Samma form oavsett om
/// innehållet kommer från regler eller från en språkmodell.</summary>
public record GeneratedAdvertisement(
    string Title,
    string FullDescription,
    string MarketplaceDescription,
    List<string> SellingPoints,
    List<string> MissingInformation,
    List<string> SalesChecklist);

public interface IAdGenerator
{
    Task<GeneratedAdvertisement> GenerateAsync(
        Vehicle vehicle,
        CancellationToken cancellationToken = default);
}