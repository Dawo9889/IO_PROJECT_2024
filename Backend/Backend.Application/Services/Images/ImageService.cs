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


        public async Task AddImageAsync(CreateImageDTO createImageDTO, Guid sessionToken)
        {
            // Walidacja sesji
            var wedding = await _weddingRepository.ValidateSessionKeyAsync(sessionToken);
            if (wedding == null)
            {
                throw new Exception("Wedding not found or session expired."); // Możesz zmienić to na bardziej odpowiedni wyjątek lub zwrócić wynik
            }

            createImageDTO.Id = Guid.NewGuid();

            // Określenie autora zdjęcia
            string author = string.IsNullOrEmpty(createImageDTO.Author) ? "anonymous" : createImageDTO.Author;



            var (originalFilePath, thumbnailFilePath) = await SaveImageFileAsync(createImageDTO, wedding.Id, author);

            // Mapowanie DTO na encję ImageData
            var imageData = _mapper.Map<ImageData>(createImageDTO);
            imageData.FilePath = originalFilePath;
            imageData.ThumbnailPath = thumbnailFilePath;
            imageData.WeddingId = wedding.Id;

            // Dodanie zdjęcia do bazy danych
            await _imageRepository.AddImageAsync(imageData);
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

            var originalFileName = imageDTO.Id.ToString() + imageExtension;
            var originalFilePath = Path.Combine(originalPhotoFolder, originalFileName);

            using (var stream = new FileStream(originalFilePath, FileMode.Create))
            {
                await imageDTO.ImageFile.CopyToAsync(stream);
            }

            //save thumbnail files
            var thumbnailFilePath = Path.Combine(thumbnailFolder, originalFileName);

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



    }
}
