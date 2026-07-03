using Microsoft.EntityFrameworkCore;
using SalesDesk.Domain.Entities;

namespace SalesDesk.Infrastructure.Data
{
    public class SalesDeskDbContext : DbContext
    {
        public SalesDeskDbContext(DbContextOptions<SalesDeskDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesOrderLine> SalesOrderLines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define Primary Keys
            modelBuilder.Entity<SalesOrder>().HasKey(so => so.OrderId);
            modelBuilder.Entity<SalesOrderLine>().HasKey(sol => sol.LineId);

            // Configure Decimal Precision
            modelBuilder.Entity<Item>().Property(i => i.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrder>().Property(so => so.TotalExcl).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrder>().Property(so => so.TotalTax).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrder>().Property(so => so.TotalIncl).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrderLine>().Property(sol => sol.Quantity).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrderLine>().Property(sol => sol.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrderLine>().Property(sol => sol.TaxRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrderLine>().Property(sol => sol.ExclAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrderLine>().Property(sol => sol.TaxAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<SalesOrderLine>().Property(sol => sol.InclAmount).HasColumnType("decimal(18,2)");

            // SalesOrder -> Client (many-to-one)
            modelBuilder.Entity<SalesOrder>()
                .HasOne(so => so.Client)
                .WithMany()
                .HasForeignKey(so => so.ClientId);

            // SalesOrderLine -> SalesOrder (many-to-one, cascade delete)
            modelBuilder.Entity<SalesOrderLine>()
                .HasOne(sol => sol.SalesOrder)
                .WithMany(so => so.SalesOrderLines)
                .HasForeignKey(sol => sol.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // SalesOrderLine -> Item (many-to-one)
            modelBuilder.Entity<SalesOrderLine>()
                .HasOne(sol => sol.Item)
                .WithMany()
                .HasForeignKey(sol => sol.ItemId);
        }
    }
}
