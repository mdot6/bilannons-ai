using BilAnnonsAI.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace BilAnnonsAI.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Advertisement> Advertisements => Set<Advertisement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.Property(v => v.Make).HasMaxLength(60).IsRequired();
            entity.Property(v => v.Model).HasMaxLength(60).IsRequired();
            entity.Property(v => v.FuelType).HasMaxLength(30).IsRequired();
            entity.Property(v => v.Transmission).HasMaxLength(30).IsRequired();
            entity.Property(v => v.RegistrationNumber).HasMaxLength(10);
            entity.Property(v => v.Color).HasMaxLength(40);
            entity.Property(v => v.Equipment).HasMaxLength(2000);
            entity.Property(v => v.ServiceHistory).HasMaxLength(2000);
            entity.Property(v => v.Condition).HasMaxLength(2000);
            entity.Property(v => v.KnownIssues).HasMaxLength(2000);
        });

        modelBuilder.Entity<Advertisement>(entity =>
        {
            entity.Property(a => a.Title).HasMaxLength(200);

            entity.HasOne(a => a.Vehicle)
                .WithOne(v => v.Advertisement)
                .HasForeignKey<Advertisement>(a => a.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(a => a.SellingPoints).HasColumnType("TEXT");
            entity.Property(a => a.MissingInformation).HasColumnType("TEXT");
            entity.Property(a => a.SalesChecklist).HasColumnType("TEXT");

            entity.PrimitiveCollection(a => a.SellingPoints);
            entity.PrimitiveCollection(a => a.MissingInformation);
            entity.PrimitiveCollection(a => a.SalesChecklist);
        });
    }
}