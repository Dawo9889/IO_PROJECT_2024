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
        Task Create(Wedding wedding);
        Task<List<Wedding>> GetAllWeddings();
    }
}
