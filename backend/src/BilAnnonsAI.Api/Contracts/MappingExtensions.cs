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
    
    /// <summary>
    /// Versaliserar varje ord, så att "volvo v70" blir "Volvo V70".
    /// Rör inte ord som redan innehåller versaler, eftersom "BMW"
    /// och "XC90" annars skulle bli "Bmw" och "Xc90".
    /// </summary>
    private static string CapitalizeWords(string value)
    {
        var words = value.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        var result = words.Select(word =>
            word.Any(char.IsUpper)
                ? word
                : char.ToUpperInvariant(word[0]) + word[1..]);

        return string.Join(' ', result);
    }

    public static Vehicle ToVehicle(this CreateAdvertisementRequest request) => new()
    {
        Make = CapitalizeWords(request.Make.Trim()),
        Model = CapitalizeWords(request.Model.Trim()),
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