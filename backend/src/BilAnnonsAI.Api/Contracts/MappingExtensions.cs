using BilAnnonsAI.Api.Domain;

namespace BilAnnonsAI.Api.Contracts;

public static class MappingExtensions
{
    /// <summary>
    /// Tom eller blanktecknad text behandlas som saknad information.
    /// Detta är avgörande för att generatorn inte ska beskriva något
    /// användaren aldrig fyllde i.
    /// </summary>
    private static string? Normalize(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    public static Vehicle ToVehicle(this CreateAdvertisementRequest request) => new()
    {
        Make = request.Make.Trim(),
        Model = request.Model.Trim(),
        ModelYear = request.ModelYear,
        Mileage = request.Mileage,
        FuelType = request.FuelType.Trim(),
        Transmission = request.Transmission.Trim(),
        RegistrationNumber = Normalize(request.RegistrationNumber)?.ToUpperInvariant().Replace(" ", ""),
        Color = Normalize(request.Color),
        Equipment = Normalize(request.Equipment),
        ServiceHistory = Normalize(request.ServiceHistory),
        Condition = Normalize(request.Condition),
        KnownIssues = Normalize(request.KnownIssues),
        AskingPrice = request.AskingPrice
    };

    public static VehicleResponse ToResponse(this Vehicle vehicle) => new()
    {
        Make = vehicle.Make,
        Model = vehicle.Model,
        ModelYear = vehicle.ModelYear,
        Mileage = vehicle.Mileage,
        FuelType = vehicle.FuelType,
        Transmission = vehicle.Transmission,
        RegistrationNumber = vehicle.RegistrationNumber,
        Color = vehicle.Color,
        Equipment = vehicle.Equipment,
        ServiceHistory = vehicle.ServiceHistory,
        Condition = vehicle.Condition,
        KnownIssues = vehicle.KnownIssues,
        AskingPrice = vehicle.AskingPrice
    };

    public static AdvertisementResponse ToResponse(this Advertisement ad) => new()
    {
        Id = ad.Id,
        Status = ad.Status.ToString(),
        Title = ad.Title,
        FullDescription = ad.FullDescription,
        MarketplaceDescription = ad.MarketplaceDescription,
        SellingPoints = ad.SellingPoints,
        MissingInformation = ad.MissingInformation,
        SalesChecklist = ad.SalesChecklist,
        CreatedAt = ad.CreatedAt,
        UpdatedAt = ad.UpdatedAt,
        Vehicle = ad.Vehicle.ToResponse()
    };
}