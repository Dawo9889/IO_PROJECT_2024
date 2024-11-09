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
    public class WeddingRepository : IWeddingRepository
    {

        private readonly ApplicationDbContext _dbContext;
        public WeddingRepository(ApplicationDbContext applicationDbContext)
        {
            _dbContext = applicationDbContext;
        }
        public async Task Create(Wedding wedding)
        {
            _dbContext.Weddings.AddAsync(wedding);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Wedding>> GetAllWeddings()
        {
            return await _dbContext.Weddings.ToListAsync();
        }
    }
}
