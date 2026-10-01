using System.Globalization;
using BilAnnonsAI.Api.Domain;

namespace BilAnnonsAI.Api.Services;

/// <summary>
/// Bygger annonsinnehåll utifrån de uppgifter användaren faktiskt har angett.
/// Ett fält som är null utelämnas helt och rapporteras som saknad information.
/// Generatorn drar aldrig slutsatser om bilens skick.
/// </summary>
public class RuleBasedAdGenerator : IAdGenerator
{
    private static readonly CultureInfo Swedish = new("sv-SE");

    public Task<GeneratedAdvertisement> GenerateAsync(
        Vehicle vehicle,
        CancellationToken cancellationToken = default)
    {
        var result = new GeneratedAdvertisement(
            BuildTitle(vehicle),
            BuildFullDescription(vehicle),
            BuildMarketplaceDescription(vehicle),
            BuildSellingPoints(vehicle),
            FindMissingInformation(vehicle),
            BuildChecklist(vehicle));

        return Task.FromResult(result);
    }

    private static string FormatNumber(int value)
        => value.ToString("N0", Swedish).Replace('\u00A0', ' ');

    private static string FormatMileage(int mileage)
        => $"{FormatNumber(mileage)} mil";

    private static string FormatPrice(int price)
        => $"{FormatNumber(price)} kr";
    
    private static string Capitalize(string value)
        => value.Length == 0 ? value : char.ToUpper(value[0], Swedish) + value[1..];

    private static string BuildTitle(Vehicle v)
    {
        var title = $"{v.Make} {v.Model} {v.ModelYear} – {v.FuelType}, "
                  + $"{v.Transmission}, {FormatMileage(v.Mileage)}";

        if (v.AskingPrice.HasValue)
        {
            title += $" – {FormatPrice(v.AskingPrice.Value)}";
        }

        return title;
    }

    private static string BuildFullDescription(Vehicle v)
    {
        var sections = new List<string>
        {
            $"{v.Make} {v.Model}, årsmodell {v.ModelYear}. "
          + $"{v.FuelType} och {v.Transmission.ToLower(Swedish)}, "
          + $"mätarställning {FormatMileage(v.Mileage)}."
        };

        if (v.Color is not null)
        {
            sections.Add($"Färg: {v.Color}.");
        }

        if (v.Equipment is not null)
        {
            sections.Add($"Utrustning: {v.Equipment}.");
        }

        if (v.ServiceHistory is not null)
        {
            sections.Add($"Servicehistorik: {v.ServiceHistory}.");
        }

        if (v.Condition is not null)
        {
            sections.Add($"Skick: {v.Condition}.");
        }

        // Kända fel redovisas alltid när de finns, aldrig nedtonade.
        if (v.KnownIssues is not null)
        {
            sections.Add($"Kända fel och brister: {v.KnownIssues}.");
        }

        if (v.AskingPrice.HasValue)
        {
            sections.Add($"Pris: {FormatPrice(v.AskingPrice.Value)}.");
        }

        sections.Add("Hör av dig om du har frågor eller vill boka en visning.");

        return string.Join("\n\n", sections);
    }

    private static string BuildMarketplaceDescription(Vehicle v)
    {
        var lines = new List<string>
        {
            $"{v.Make} {v.Model} {v.ModelYear}",
            $"{v.FuelType} · {v.Transmission} · {FormatMileage(v.Mileage)}"
        };

        if (v.KnownIssues is not null)
        {
            lines.Add($"Kända fel: {v.KnownIssues}");
        }

        if (v.AskingPrice.HasValue)
        {
            lines.Add($"Pris: {FormatPrice(v.AskingPrice.Value)}");
        }

        lines.Add("Skicka ett meddelande vid intresse.");

        return string.Join("\n", lines);
    }

    private static List<string> BuildSellingPoints(Vehicle v)
    {
        var points = new List<string>();

        var age = Math.Max(1, DateTime.UtcNow.Year - v.ModelYear);
        var milPerYear = v.Mileage / age;
        if (milPerYear < 1200)
        {
            points.Add($"Körd cirka {milPerYear.ToString("N0", Swedish)} mil per år");
        }

        if (v.ServiceHistory is not null)
        {
            points.Add("Servicehistorik finns angiven");
        }

        if (v.Equipment is not null)
        {
            var items = v.Equipment
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Take(3);

            points.AddRange(items.Select(Capitalize));
        }

        if (v.Transmission.Contains("automat", StringComparison.OrdinalIgnoreCase))
        {
            points.Add("Automatlåda");
        }

        return points;
    }

    private static List<string> FindMissingInformation(Vehicle v)
    {
        var missing = new List<string>();

        if (v.Color is null) missing.Add("Färg");
        if (v.Equipment is null) missing.Add("Utrustning och extrautrustning");
        if (v.ServiceHistory is null) missing.Add("Servicehistorik");
        if (v.Condition is null) missing.Add("Beskrivning av bilens skick");
        if (v.AskingPrice is null) missing.Add("Önskat pris");

        // Avsaknad av ifyllt fält betyder inte att bilen saknar fel.
        if (v.KnownIssues is null)
        {
            missing.Add("Kända fel eller skador – ange även om du inte känner till några");
        }

        // Dessa fält finns inte i datamodellen ännu, men köpare frågar alltid efter dem.
        missing.Add("Senaste besiktning");
        missing.Add("Antal tidigare ägare");
        missing.Add("Däck och eventuellt extra hjulsats");

        return missing;
    }

    private static List<string> BuildChecklist(Vehicle v)
    {
        var checklist = new List<string>
        {
            "Tvätta och städa bilen före fotografering",
            "Fotografera utomhus i dagsljus, gärna molnigt väder",
            "Ta bilder framifrån, bakifrån och från båda sidor",
            "Fotografera interiören, baksätet och bagageutrymmet",
            "Ta en tydlig bild av mätarställningen",
            "Ha servicebok och besiktningsprotokoll tillgängligt",
            "Kontrollera uppgifterna i annonsen innan du publicerar"
        };

        if (v.KnownIssues is not null)
        {
            checklist.Add("Fotografera de kända felen så att köparen ser dem i förväg");
        }

        return checklist;
    }
}