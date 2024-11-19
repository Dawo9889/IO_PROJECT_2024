using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Interfaces
{
    public interface InterfaceImageRepository
    {
        Task<bool> AddImageAsync(ImageData image);
        Task<List<ImageData>> GetAllImagesFromWeddingAsync(Guid weddingId);
    }
}
