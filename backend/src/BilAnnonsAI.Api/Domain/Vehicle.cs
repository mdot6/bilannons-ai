namespace BilAnnonsAI.Api.Domain;

public class Vehicle
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Obligatoriska uppgifter
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int ModelYear { get; set; }
    public int Mileage { get; set; }
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;

    // Frivilliga uppgifter. Null betyder "användaren har inte angett detta".
    public string? RegistrationNumber { get; set; }
    public string? Color { get; set; }
    public string? Equipment { get; set; }
    public string? ServiceHistory { get; set; }
    public string? Condition { get; set; }
    public string? KnownIssues { get; set; }
    public int? AskingPrice { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Advertisement? Advertisement { get; set; }
}