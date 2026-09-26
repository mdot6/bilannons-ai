namespace BilAnnonsAI.Api.Domain;

public class Advertisement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;

    // Null tills generatorn har körts.
    public string? Title { get; set; }
    public string? FullDescription { get; set; }
    public string? MarketplaceDescription { get; set; }

    public List<string> SellingPoints { get; set; } = [];
    public List<string> MissingInformation { get; set; } = [];
    public List<string> SalesChecklist { get; set; } = [];

    public AdvertisementStatus Status { get; set; } = AdvertisementStatus.Draft;
    public bool IsPaid { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public enum AdvertisementStatus
{
    Draft = 0,
    Generated = 1
}