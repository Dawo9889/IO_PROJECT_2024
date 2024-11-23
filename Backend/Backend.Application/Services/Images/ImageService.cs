using AutoMapper;
using Backend.Application.DTO.ImageDTO;
using Backend.Application.DTO.WeddingDTO;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using Microsoft.Extensions.Configuration;

namespace Backend.Application.Services.Images
{
    public class ImageService : InterfaceImageService
    {

        private readonly InterfaceImageRepository _imageRepository;
        private readonly IWeddingRepository _weddingRepository;
        private readonly IMapper _mapper;
        private readonly string _photosBasePath;
        private readonly string _baseBackendUrl;

        public ImageService(InterfaceImageRepository imageRepository, IWeddingRepository weddingRepository, IMapper mapper, IConfiguration configuration)
        {
            _imageRepository = imageRepository;
            _weddingRepository = weddingRepository;
            _mapper = mapper;

            _photosBasePath = Environment.GetEnvironmentVariable("PHOTOS_PATH")
                          ?? Path.Combine(Directory.GetCurrentDirectory(), "zdjecia");

            _baseBackendUrl = configuration["BaseBackendUrl"] ?? "https://localhost:7017";
        }


        public async Task<bool> AddImageAsync(CreateImageDTO createImageDTO, Guid sessionToken)
        {
            // Session Validation
            var wedding = await _weddingRepository.ValidateSessionKeyAsync(sessionToken);
            if (wedding == null)
            {
                
                return false;
            }

            createImageDTO.Id = Guid.NewGuid();
            //file extension validation
            var valid = await ValidateImageFileAsync(createImageDTO.ImageFile.OpenReadStream(), createImageDTO.ImageFile.FileName);
            if (!valid)
            {
                return false;
            }
            // Set author of the photo
            string author = string.IsNullOrEmpty(createImageDTO.Author) ? "anonymous" : createImageDTO.Author;


            var (originalFilePath, thumbnailFilePath) = await SaveImageFileAsync(createImageDTO, wedding.Id, author);

            // Mapping DTO
            var imageData = _mapper.Map<ImageData>(createImageDTO);
            imageData.FilePath = originalFilePath;
            imageData.ThumbnailPath = thumbnailFilePath;
            imageData.WeddingId = wedding.Id;

      
            await _imageRepository.AddImageAsync(imageData);
            return true;
        }

        private async Task<bool> ValidateImageFileAsync(Stream fileStream, string fileName)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return false;
            }

            try
            {
                
                using (var image = await Image.LoadAsync(fileStream))
                {
                    return true;
                }
            }
            catch (UnknownImageFormatException)
            {
                
                return false ;
            }
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

        // Metoda do zapisywania pliku na dysku
        public async Task<(string originalPath, string thumbnailPath)> SaveImageFileAsync(CreateImageDTO imageDTO, Guid weddingId, string author)
        {
            // Ścieżka folderu, gdzie będą przechowywane zdjęcia
            var weddingFolderPath = Path.Combine(_photosBasePath, weddingId.ToString());
            var imageFolderPath = Path.Combine(weddingFolderPath, imageDTO.Id.ToString());

            if (!Directory.Exists(imageFolderPath))
            {
                Directory.CreateDirectory(imageFolderPath);
            }

            var originalPhotoFolder = Path.Combine(imageFolderPath, "originalPhoto");
            var thumbnailFolder = Path.Combine(imageFolderPath, "thumbnail");
            if (!Directory.Exists(originalPhotoFolder))
            {
                Directory.CreateDirectory(originalPhotoFolder);
            }

            if (!Directory.Exists(thumbnailFolder))
            {
                Directory.CreateDirectory(thumbnailFolder);
            }

            //save original files
            var imageExtension = Path.GetExtension(imageDTO.ImageFile.FileName);

            var originalPhotoName = "originalPhoto" + imageExtension;
            var originalFilePath = Path.Combine(originalPhotoFolder, originalPhotoName);

            using (var stream = new FileStream(originalFilePath, FileMode.Create))
            {
                await imageDTO.ImageFile.CopyToAsync(stream);
            }

            //save thumbnail files
            var thumbnailFilePath = Path.Combine(thumbnailFolder, "thumbnail" + imageExtension);

            using (var thumbnailStream = await GenerateThumbnailAsync(imageDTO, 400, 400)) // Rozmiar miniaturki
            {
                using (var fileStream = new FileStream(thumbnailFilePath, FileMode.Create))
                {
                    await thumbnailStream.CopyToAsync(fileStream);
                }
            }

            return (originalFilePath, thumbnailFilePath);
        }


        public async Task<Stream> GenerateThumbnailAsync(CreateImageDTO imageDTO, int width, int height)
        {
 
            using var originalStream = imageDTO.ImageFile.OpenReadStream();

  
            var thumbnailStream = new MemoryStream();


            using (var image = await Image.LoadAsync(originalStream))
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(width, height),
                    Mode = ResizeMode.Max 
                }));


                var encoder = new JpegEncoder { Quality = 75 }; 
                await image.SaveAsync(thumbnailStream, encoder);
            }


            thumbnailStream.Position = 0;

            return thumbnailStream;
        }

        public async Task<List<ImagesDataDTO>> GetImagesForWeddingAsync(Guid weddingId, string userId)
        {
            if (!await _weddingRepository.IsUserOwnerOfWedding(weddingId, userId))
            {
                return null;
            }

            var imageDatas = await _imageRepository.GetAllImagesFromWeddingAsync(weddingId);
            foreach (var image in imageDatas)
            {
                image.FilePath = ConvertFilePathToUrl(image.FilePath);
                image.ThumbnailPath = ConvertFilePathToUrl(image.ThumbnailPath);
            }
            var imagesDataDTO = _mapper.Map<List<ImagesDataDTO>>(imageDatas);
            return imagesDataDTO;
        }
        private string ConvertFilePathToUrl(string filePath)
        {
  
            var relativePath = Path.GetRelativePath(_photosBasePath, filePath).Replace("\\", "/"); 
            return $"{_baseBackendUrl}/api/image/{relativePath}";
        }

        public async Task<(Stream FileStream, string MimeType)> GetPhotoThumbnailFile(string path)
        {
            var filePath = Path.Combine(_photosBasePath, path);

            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            string mimeType;

            switch (extension)
            {
                case ".jpg":
                case ".jpeg":
                    mimeType = "image/jpeg";
                    break;
                case ".png":
                    mimeType = "image/png";
                    break;
                default:
                    mimeType = "application/octet-stream";
                    break;
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            
            return (fileStream, mimeType);
        }
    }
}
