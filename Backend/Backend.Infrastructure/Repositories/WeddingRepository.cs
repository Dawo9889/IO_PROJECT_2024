
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
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



        public async Task<bool> Create(Wedding wedding, string userId)
        {

            await _dbContext.Weddings.AddAsync(wedding);

       
            var result = await _dbContext.SaveChangesAsync();


            if (result > 0)
            {
                // Creating many to many realtions between wedding and user
                var WeddingUser = new WeddingUser
                {
                    UserId = userId,     
                    WeddingId = wedding.Id   
                };

                
                await _dbContext.WeddingUser.AddAsync(WeddingUser);

                
                var saveChangesResult = await _dbContext.SaveChangesAsync();

                return saveChangesResult > 0;
            }

            return false;
        }


        public async Task<bool> IsUserOwnerOfWedding(Guid weddingId, string userId)
        {
            return await _dbContext.WeddingUser
                .AnyAsync(wa => wa.WeddingId == weddingId && wa.UserId == userId);
            
        }


        public async Task<List<Wedding>> GetAllWeddings()
        {
            return await _dbContext.Weddings.ToListAsync();
        }

        public async Task<List<Wedding>> GetWeddingsByUser(string userID)
        {
            var weddings = await _dbContext.WeddingUser
                .Where(wa => wa.UserId == userID)
                .Select(w => new Wedding
                {
                    Id = w.WeddingId,
                    Name = w.Wedding.Name,
                    Description = w.Wedding.Description,
                    EventDate = w.Wedding.EventDate,
                })
                .ToListAsync();
            return weddings;
        }

        public async Task<Wedding> GetDetailsById(Guid id)
        {
            
            var result = await _dbContext.Weddings
                .Include(w => w.ImageDatas)
                .FirstOrDefaultAsync(x => x.Id == id);
            if(result == null)
            {
                return null;
            }
            return result;
        }



        public async Task<bool> DeleteWeedingById(Guid id)
        {

            var wedding = await _dbContext.Weddings.FirstOrDefaultAsync(x => x.Id == id);

            if (wedding == null)
            {
                return false;
            }
            _dbContext.Weddings.Remove(wedding);

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Update(Wedding newWedding)
        {
            _dbContext.Weddings.Update(newWedding);
            var result = await _dbContext.SaveChangesAsync();
            return result > 0;
        }

        public async Task<Wedding> ValidateSessionKeyAsync(Guid sessionToken)
        {
            var wedding = await _dbContext.Weddings.FirstOrDefaultAsync(x => x.SessionKey == sessionToken);

            if (wedding == null)
            {
                return null;
            }
            if (!wedding.IsSessionKeyExpired)
            {
                return wedding;
            }

            return null;

        }

      
    }
}
