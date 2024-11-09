using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Services
{
    public class WeddingService : IWeddingService
    {
        private readonly IWeddingRepository _weddingRepository;
        public WeddingService(IWeddingRepository weddingRepository)
        {
            _weddingRepository = weddingRepository;
        }
        public async Task Create(Wedding wedding)
        {
            await _weddingRepository.Create(wedding);
        }

        public async Task<List<Wedding>> GetAllWeddings()
        {
            var weddings = await _weddingRepository.GetAllWeddings();
            return weddings;
        }
    }
}
