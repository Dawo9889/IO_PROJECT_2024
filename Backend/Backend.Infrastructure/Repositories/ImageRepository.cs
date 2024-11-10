using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Repositories
{
    public class ImageRepository : InterfaceImageRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public ImageRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddImageAsync(ImageData image)
        {
            var weddingId = Guid.Parse("c74524db-6d1c-44d8-8d2c-ae9816fa2b75");
            var wedding = await _dbContext.Weddings.FirstOrDefaultAsync(x => x.Id == weddingId);

            image.WeddingId = weddingId;
            _dbContext.ImageDatas.Add(image);
            var result = await _dbContext.SaveChangesAsync();

            // Jeśli zapisano co najmniej jedno zdjęcie, zwróć true
            return result > 0;
        }
    }
}
