using AutoMapper;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Services.Images
{
    public class ImageService : InterfaceImageService
    {

        private readonly InterfaceImageRepository _imageRepository;
        private readonly IWeddingRepository _weddingRepository;
        private readonly IMapper _mapper;
        private readonly string _photosBasePath;

        public ImageService(InterfaceImageRepository imageRepository, IWeddingRepository weddingRepository, IMapper mapper)
        {
            _imageRepository = imageRepository;
            _weddingRepository = weddingRepository;
            _mapper = mapper;

            _photosBasePath = Environment.GetEnvironmentVariable("PHOTOS_PATH")
                          ?? Path.Combine(Directory.GetCurrentDirectory(), "zdjecia");
        }


        public Task AddImageAsync(ImageData imageData)
        {
            throw new NotImplementedException();
        }



        public async Task<bool> IsSessionValid(Guid sessionToken)
        {
            var wedding = await _weddingRepository.ValidateSessionKeyAsync(sessionToken);

            if (wedding == null)
            {
                return false; 
            }
            return true;
        }
    }
}
