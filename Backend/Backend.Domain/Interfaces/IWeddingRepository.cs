using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Interfaces
{
    public interface IWeddingRepository
    {
        Task<bool> Create(Wedding wedding, String userId);

        Task<List<Wedding>> GetAllWeddings();
        Task<List<Wedding>> GetWeddingsByUser(string userID);
        Task<Wedding> GetDetailsById(Guid id);

        Task<bool> DeleteWeedingById(Guid id);

        Task<bool> Update(Wedding wedding);

        Task<Wedding> ValidateSessionKeyAsync(Guid sessionToken);

        

    }
}
