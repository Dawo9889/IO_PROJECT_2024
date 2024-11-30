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
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options) 
        {

        }
        public DbSet<Wedding> Weddings { get; set; }
        public DbSet<ImageData> ImageDatas { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<WeddingUser> WeddingUser{ get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ImageData>()
                .HasOne(i => i.Wedding)
                .WithMany(w => w.ImageDatas)
                .HasForeignKey(i => i.WeddingId)
                .OnDelete(DeleteBehavior.Cascade);



            modelBuilder.Entity<WeddingUser>()
                .HasKey(wc => new { wc.WeddingId, wc.UserId });

            modelBuilder.Entity<WeddingUser>()
                .HasOne(wc => wc.Wedding)
                .WithMany(w => w.WeddingUser)
                .HasForeignKey(wc => wc.WeddingId)
                .OnDelete(DeleteBehavior.Cascade); 

            modelBuilder.Entity<WeddingUser>()
                .HasOne(wc => wc.User)
                .WithMany(a => a.WeddingUser)
                .HasForeignKey(wc => wc.UserId);
        }

    }
}
