using Backend.Application.DTO.ImageDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Services.Images
{
    public interface InterfaceImageService
    {
        Task AddImageAsync(CreateImageDTO createImageDTO, Guid sessionToken);
        Task<bool> IsSessionValid(Guid sessionToken);
    }
}
