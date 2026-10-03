using System.ComponentModel.DataAnnotations;

namespace BilAnnonsAI.Api.Contracts;

public class CreateAdvertisementRequest
{
    [Required(ErrorMessage = "Märke måste anges.")]
    [StringLength(60, MinimumLength = 2, ErrorMessage = "Märke måste vara mellan 2 och 60 tecken.")]
    public string Make { get; set; } = string.Empty;

    [Required(ErrorMessage = "Modell måste anges.")]
    [StringLength(60, MinimumLength = 1, ErrorMessage = "Modell får vara högst 60 tecken.")]
    public string Model { get; set; } = string.Empty;

    [Range(1900, 2100, ErrorMessage = "Modellår måste vara mellan 1900 och 2100.")]
    public int ModelYear { get; set; }

    /// <summary>Mätarställning i mil (inte kilometer).</summary>
    [Range(0, 100_000, ErrorMessage = "Miltal måste vara mellan 0 och 100 000 mil.")]
    public int Mileage { get; set; }

    [Required(ErrorMessage = "Bränsletyp måste anges.")]
    [StringLength(30)]
    public string FuelType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Växellåda måste anges.")]
    [StringLength(30)]
    public string Transmission { get; set; } = string.Empty;

    [RegularExpression(@"^[A-Za-zÅÄÖåäö]{3}\s?[0-9]{2}[0-9A-Za-z]$",
        ErrorMessage = "Registreringsnumret ser inte ut som ett svenskt nummer, till exempel ABC123 eller ABC12A.")]
    public string? RegistrationNumber { get; set; }

    [StringLength(40)]
    public string? Color { get; set; }

    [StringLength(2000)]
    public string? Equipment { get; set; }

    [StringLength(2000)]
    public string? ServiceHistory { get; set; }

    [StringLength(2000)]
    public string? Condition { get; set; }

    [StringLength(2000)]
    public string? KnownIssues { get; set; }

    [Required(ErrorMessage = "Önskat pris måste anges.")]
    [Range(0, 10_000_000, ErrorMessage = "Pris måste vara mellan 0 och 10 000 000 kronor.")]
    public int? AskingPrice { get; set; }
}