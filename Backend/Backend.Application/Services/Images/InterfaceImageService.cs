using Backend.Application.DTO.ImageDTO;
using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Services.Images
{
    public interface InterfaceImageService
    {
        Task<bool> AddImageAsync(CreateImageDTO createImageDTO, Guid sessionToken);
        Task<bool> IsSessionValid(Guid sessionToken);
        Task<List<ImageData>> GetImagesForWeddingAsync(Guid weddingId, string userId);
        Task<(Stream FileStream, string MimeType)> GetPhotoThumbnailFile(string path);
    }
}
