using BilAnnonsAI.Api.Domain;
using BilAnnonsAI.Api.Services;

namespace BilAnnonsAI.Tests;

public class RuleBasedAdGeneratorTests
{
    private readonly RuleBasedAdGenerator _generator = new();

    /// <summary>En bil med enbart obligatoriska uppgifter.</summary>
    private static Vehicle MinimalVehicle() => new()
    {
        Make = "Toyota",
        Model = "Yaris",
        ModelYear = 2019,
        Mileage = 4200,
        FuelType = "Bensin",
        Transmission = "Manuell"
    };

    private static Vehicle CompleteVehicle() => new()
    {
        Make = "Volvo",
        Model = "V70",
        ModelYear = 2015,
        Mileage = 14500,
        FuelType = "Diesel",
        Transmission = "Automat",
        Color = "Mörkblå",
        Equipment = "Dragkrok, farthållare, vinterdäck på fälg",
        ServiceHistory = "Servad enligt schema",
        Condition = "Gott skick",
        KnownIssues = "Vänster bakljus behöver bytas",
        AskingPrice = 89000
    };

    [Fact]
    public async Task Titeln_innehaller_grunduppgifterna()
    {
        var result = await _generator.GenerateAsync(MinimalVehicle());

        Assert.Contains("Toyota", result.Title);
        Assert.Contains("Yaris", result.Title);
        Assert.Contains("2019", result.Title);
        Assert.Contains("4 200 mil", result.Title);
    }

    [Fact]
    public async Task Titeln_utelamnar_pris_nar_pris_saknas()
    {
        var result = await _generator.GenerateAsync(MinimalVehicle());

        Assert.DoesNotContain("kr", result.Title);
    }

    [Fact]
    public async Task Annonsen_namner_bara_falt_som_har_varden()
    {
        var result = await _generator.GenerateAsync(MinimalVehicle());

        Assert.DoesNotContain("Färg", result.FullDescription);
        Assert.DoesNotContain("Utrustning", result.FullDescription);
        Assert.DoesNotContain("Servicehistorik", result.FullDescription);
        Assert.DoesNotContain("Skick", result.FullDescription);
        Assert.DoesNotContain("Pris", result.FullDescription);
    }

    /// <summary>
    /// Kärnkravet: avsaknad av ifyllda fel får aldrig tolkas som att
    /// bilen är felfri.
    /// </summary>
    [Fact]
    public async Task Annonsen_pastar_aldrig_att_bilen_saknar_fel()
    {
        var result = await _generator.GenerateAsync(MinimalVehicle());

        var text = result.FullDescription + result.MarketplaceDescription
                 + string.Join(" ", result.SellingPoints);

        Assert.DoesNotContain("inga kända fel", text, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("felfri", text, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("helt utan anmärkning", text, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Kanda_fel_redovisas_i_bade_annons_och_marketplace()
    {
        var result = await _generator.GenerateAsync(CompleteVehicle());

        Assert.Contains("Vänster bakljus behöver bytas", result.FullDescription);
        Assert.Contains("Vänster bakljus behöver bytas", result.MarketplaceDescription);
    }

    [Fact]
    public async Task Saknade_falt_rapporteras_som_saknad_information()
    {
        var result = await _generator.GenerateAsync(MinimalVehicle());

        Assert.Contains("Färg", result.MissingInformation);
        Assert.Contains("Servicehistorik", result.MissingInformation);
        Assert.Contains("Önskat pris", result.MissingInformation);
        Assert.Contains(result.MissingInformation, m => m.StartsWith("Kända fel"));
    }

    [Fact]
    public async Task Ifyllda_falt_rapporteras_inte_som_saknade()
    {
        var result = await _generator.GenerateAsync(CompleteVehicle());

        Assert.DoesNotContain("Färg", result.MissingInformation);
        Assert.DoesNotContain("Servicehistorik", result.MissingInformation);
        Assert.DoesNotContain("Önskat pris", result.MissingInformation);
    }

    [Fact]
    public async Task Forsaljningsargument_borjar_med_versal()
    {
        var result = await _generator.GenerateAsync(CompleteVehicle());

        Assert.NotEmpty(result.SellingPoints);
        Assert.All(result.SellingPoints, p => Assert.True(char.IsUpper(p[0]), $"'{p}' saknar versal."));
    }

    [Fact]
    public async Task Siffror_formateras_utan_hart_mellanslag()
    {
        var result = await _generator.GenerateAsync(CompleteVehicle());

        Assert.DoesNotContain('\u00A0', result.Title);
        Assert.DoesNotContain('\u00A0', result.FullDescription);
    }

    [Fact]
    public async Task Checklistan_namner_fotografering_av_fel_endast_nar_fel_finns()
    {
        var withIssues = await _generator.GenerateAsync(CompleteVehicle());
        var without = await _generator.GenerateAsync(MinimalVehicle());

        Assert.Contains(withIssues.SalesChecklist, c => c.Contains("kända felen"));
        Assert.DoesNotContain(without.SalesChecklist, c => c.Contains("kända felen"));
    }

    [Fact]
    public async Task Generatorn_laggar_inte_till_utrustning_som_inte_angetts()
    {
        var result = await _generator.GenerateAsync(MinimalVehicle());

        var text = result.FullDescription + string.Join(" ", result.SellingPoints);

        Assert.DoesNotContain("dragkrok", text, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("farthållare", text, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("navigation", text, StringComparison.OrdinalIgnoreCase);
    }
}