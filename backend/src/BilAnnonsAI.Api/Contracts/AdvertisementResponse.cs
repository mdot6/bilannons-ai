namespace BilAnnonsAI.Api.Contracts;

public class AdvertisementResponse
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;

    public string? Title { get; set; }
    public string? FullDescription { get; set; }
    public string? MarketplaceDescription { get; set; }

    public List<string> SellingPoints { get; set; } = [];
    public List<string> MissingInformation { get; set; } = [];
    public List<string> SalesChecklist { get; set; } = [];

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public VehicleResponse Vehicle { get; set; } = null!;
}