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
        Task<List<ImagesDataDTO>> GetImagesDataForWeddingAsync(Guid weddingId, string userId, int pageNumber);
        Task<(Stream FileStream, string MimeType)> GetPhotoThumbnailFile(string path);

        Task<bool> DeleteImageFromDbAndFile(Guid weddingId, string userId, Guid imageId);
        
    }
}
