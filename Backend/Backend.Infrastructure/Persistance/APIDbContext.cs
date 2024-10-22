using Backend.Domain;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Persistance
{
    internal class APIDbContext : DbContext
    {
        public APIDbContext(DbContextOptions<APIDbContext> options): base(options) 
        {

        }
        public DbSet<Wedding> Weddings { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Wedding_CEO> Wedding_CEOs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Wedding_CEO>()
                .HasKey(wc => new { wc.WeddingId, wc.AccountId });

            modelBuilder.Entity<Wedding_CEO>()
                .HasOne(wc => wc.Wedding)
                .WithMany(w => w.Wedding_CEOs)
                .HasForeignKey(wc => wc.WeddingId);

            modelBuilder.Entity<Wedding_CEO>()
                .HasOne(wc => wc.Account)
                .WithMany(a => a.Wedding_CEOs)
                .HasForeignKey(wc => wc.AccountId);
        }
    }
}
