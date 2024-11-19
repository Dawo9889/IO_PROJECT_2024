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

            // Określenie autora zdjęcia
            string author = string.IsNullOrEmpty(createImageDTO.Author) ? "anonymous" : createImageDTO.Author;

            // Wywołanie metody zapisującej plik
            var filePath = await SaveImageFileAsync(createImageDTO.ImageFile, wedding.Name, wedding.EventDate, author);

            // Mapowanie DTO na encję ImageData
            var imageData = _mapper.Map<ImageData>(createImageDTO);
            imageData.FilePath = filePath;
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
            //
        }








        // Metoda do zapisywania pliku na dysku
        public async Task<string> SaveImageFileAsync(IFormFile imageFile, string weddingName, DateOnly eventDate, string author)
        {
            // Ścieżka folderu, gdzie będą przechowywane zdjęcia
            var sanitazedName = weddingName.Trim().Replace(" ", "_"); 
            var weddingFolderPath = Path.Combine(_photosBasePath, sanitazedName + "_" + eventDate.ToString("yyyy-MM-dd"));

            if (!Directory.Exists(weddingFolderPath))
            {
                Directory.CreateDirectory(weddingFolderPath);
            }

            var fileName = author + "_" + DateTime.Now.ToString("yyyy-MM-dd_HH:mm:ss") + Path.GetExtension(imageFile.FileName);

            var filePath = Path.Combine(weddingFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            return filePath;
        }
    }



}
