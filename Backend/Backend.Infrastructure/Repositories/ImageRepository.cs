﻿using Backend.Domain.Entities;
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

            _dbContext.ImageDatas.Add(image);
            var result = await _dbContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<List<ImageData>> GetAllImagesFromWeddingAsync(Guid weddingId, int pageNumber)
        {
            int pageSize = 24;
            if(pageNumber <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(pageNumber));
            }
            var imagesDatas = await _dbContext.ImageDatas
                .Where(image => image.WeddingId == weddingId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .OrderBy(image => image.CreatedAt)
                .ToListAsync();

            if(imagesDatas == null)
            {
                return null;
            }
            return imagesDatas;
        }
    }
}
