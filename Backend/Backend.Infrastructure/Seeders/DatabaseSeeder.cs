using Backend.Domain.Entities;
using Backend.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Seeders
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _dbContext;

        public DatabaseSeeder(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Seed()
        {
            if (await _dbContext.Database.CanConnectAsync())
            {
                // Check if data is already seeded
                if (!await _dbContext.Accounts.AnyAsync())
                {
                    await SeedAccounts();
                }

                if (!await _dbContext.Weddings.AnyAsync())
                {
                    await SeedWeddings();
                }

                if (!await _dbContext.Images.AnyAsync())
                {
                    await SeedImages();
                }

                if (!await _dbContext.WeddingAdmin.AnyAsync())
                {
                    await SeedWeddingCEOs();
                }

                // Save changes if new data has been added
                await _dbContext.SaveChangesAsync();
            }
        }

        private async Task SeedAccounts()
        {
            var accounts = new List<Account>
            {
                new Account
                {
                    Id = Guid.NewGuid(),
                    Name = "John Doe",
                    Email = "john@example.com"
                },
                new Account
                {
                    Id = Guid.NewGuid(),
                    Name = "Jane Smith",
                    Email = "jane@example.com"
                }
            };

            await _dbContext.Accounts.AddRangeAsync(accounts);
        }

        private async Task SeedWeddings()
        {
            var weddings = new List<Wedding>
            {
                new Wedding
                {
                    Id = Guid.NewGuid(),
                    EventDate = new DateOnly(2024, 6, 15),
                    Description = "A beautiful summer wedding."
                },
                new Wedding
                {
                    Id = Guid.NewGuid(),
                    EventDate = new DateOnly(2024, 8, 25),
                    Description = "An elegant autumn wedding."
                }
            };

            await _dbContext.Weddings.AddRangeAsync(weddings);
        }

        private async Task SeedImages()
        {
            // Ensure that there are weddings to associate images with
            var weddings = await _dbContext.Weddings.ToListAsync();
            if (!weddings.Any())
            {
                // No weddings available to seed images
                return; // Exit the method if there are no weddings
            }

            var images = new List<Image>
            {
                new Image
                {
                    Id = Guid.NewGuid(),
                    FilePath = "/images/wedding1/photo1.jpg",
                    Author = "John Doe",
                    WeddingId = weddings.First().Id // Assuming the first wedding
                },
                new Image
                {
                    Id = Guid.NewGuid(),
                    FilePath = "/images/wedding2/photo1.jpg",
                    Author = "Jane Smith",
                    WeddingId = weddings.Last().Id // Assuming the second wedding
                }
            };

            await _dbContext.Images.AddRangeAsync(images);
        }

        private async Task SeedWeddingCEOs()
        {
            // Ensure that there are accounts and weddings to associate
            var accounts = await _dbContext.Accounts.ToListAsync();
            var weddings = await _dbContext.Weddings.ToListAsync();
            if (!accounts.Any() || !weddings.Any())
            {
                // No accounts or weddings available to seed Wedding_CEOs
                return; // Exit the method if there are no accounts or weddings
            }

            var weddingCEOs = new List<WeddingAdmin>
            {
                new WeddingAdmin
                {
                    WeddingId = weddings.First().Id,
                    AccountId = accounts.First().Id
                },
                new WeddingAdmin
                {
                    WeddingId = weddings.Last().Id,
                    AccountId = accounts.Last().Id
                }
            };

            await _dbContext.WeddingAdmin.AddRangeAsync(weddingCEOs);
        }
    }
}
