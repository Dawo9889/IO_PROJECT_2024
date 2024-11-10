using Backend.Domain;
using Backend.Domain.Entities;
using Backend.Infrastructure.Seeders;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Persistance
{
    public class ApplicationDbContext : IdentityDbContext<Account>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options) 
        {

        }
        public DbSet<Wedding> Weddings { get; set; }
        public DbSet<ImageData> ImageDatas { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<WeddingAdmin> WeddingAdmin { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<WeddingAdmin>()
                .HasKey(wc => new { wc.WeddingId, wc.AccountId });

            modelBuilder.Entity<WeddingAdmin>()
                .HasOne(wc => wc.Wedding)
                .WithMany(w => w.WeddingAdmin)
                .HasForeignKey(wc => wc.WeddingId);

            modelBuilder.Entity<WeddingAdmin>()
                .HasOne(wc => wc.Account)
                .WithMany(a => a.WeddingAdmin)
                .HasForeignKey(wc => wc.AccountId);
        }

    }
}
