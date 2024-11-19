﻿using AutoMapper;
using Backend.Application.DTO.WeddingDTO;
using Backend.Domain.Interfaces;
using Backend.Domain.Entities;
using QRCoder;
using Microsoft.Extensions.Logging.Abstractions;


namespace Backend.Application.Services.Wedding
{
    public class WeddingService : IWeddingService
    {
        private readonly IWeddingRepository _weddingRepository;
        private readonly IMapper _mapper;
        private readonly string _photosBasePath;



        public WeddingService(IWeddingRepository weddingRepository, IMapper mapper)
        {
            _weddingRepository = weddingRepository;
            _mapper = mapper;

            //pobranie sciezki do zdjec ze zmiennej srodowiskowej, ewentualnie folder projektu
            _photosBasePath = Environment.GetEnvironmentVariable("PHOTOS_PATH")
                          ?? Path.Combine(Directory.GetCurrentDirectory(), "zdjecia");
        }



        public async Task Create(WeddingDTO weddingDTO, string userId)
        {
            // Mapowanie 
            var wedding = _mapper.Map<Domain.Entities.Wedding>(weddingDTO);
            var result = await _weddingRepository.Create(wedding, userId);


            
            if (result)
            {
                
                // Ścieżka do folderu, gdzie mają być przechowywane zdjęcia
                var weddingFolderPath = Path.Combine(_photosBasePath, wedding.Id.ToString());

                if (!Directory.Exists(weddingFolderPath))
                {
                    Directory.CreateDirectory(weddingFolderPath);
                }
            }
            else
            {
                throw new Exception("Error with creating wedding Folder");
            }
        }


        public async Task<List<WeddingDTO>> GetAllWeddings()
        {
            var weddings = await _weddingRepository.GetAllWeddings();

            var weddingsDTO = _mapper.Map<List<WeddingDTO>>(weddings);

            return weddingsDTO;
        }

        public async Task<List<WeddingDTO>> GetAllWeddingsByUser(string userID)
        {
            var userWeddings = await _weddingRepository.GetWeddingsByUser(userID);
            var weddingsDTO = _mapper.Map<List<WeddingDTO>>(userWeddings);
            return weddingsDTO;
        }

        public async Task<WeddingDetailsDTO> GetWeddingDetailsById(Guid id, string userId)
        {
            if (!await _weddingRepository.IsUserOwnerOfWedding(id, userId)) 
            {
                return null; 
            }
            var wedding = await _weddingRepository.GetDetailsById(id);
            var weddingDetailsDTO = _mapper.Map<WeddingDetailsDTO>(wedding);
            return weddingDetailsDTO;
        }


        public async Task<bool> Delete(Guid id, string userId)
        {
            if (!await _weddingRepository.IsUserOwnerOfWedding(id, userId))
            {
                return false;
            }
            return await _weddingRepository.DeleteWeedingById(id);
        }


        public async Task<bool> Update(WeddingDTO newWeddingDTO, string userId)
        {
            

            var oldWedding = await _weddingRepository.GetDetailsById(newWeddingDTO.Id);

            if (oldWedding == null || !await _weddingRepository.IsUserOwnerOfWedding(newWeddingDTO.Id, userId) )
            {
                return false;
            }
            

            var updatedWedding = _mapper.Map(newWeddingDTO, oldWedding);
            var updateSuccess = await _weddingRepository.Update(oldWedding);
            return updateSuccess;
        }

        public async Task<bool> UpdateSessionKeyExpiration(Guid Id, TimeSpan extensionDuration, string userId)
        {
            if (!await _weddingRepository.IsUserOwnerOfWedding(Id, userId))
            {
                return false;
            }


            var wedding = await _weddingRepository.GetDetailsById(Id);

            if (wedding == null)
            {
                return false; 
            }

            if (extensionDuration == TimeSpan.Zero)
            {
                // InvalidateToken
                wedding.SessionKeyExpirationDate = new DateTime(1970, 1, 1);
            }
            else
            {
                // Eztend Token
                wedding.SessionKeyExpirationDate = DateTime.UtcNow.Add(extensionDuration);
            }

            await _weddingRepository.Update(wedding);

            return true; 
        }




        public async Task<byte[]> GetQrCode(Guid weddingId, string userId)
        {
            if (!await _weddingRepository.IsUserOwnerOfWedding(weddingId, userId))
            {
                return null;
            }


            var wedding = await _weddingRepository.GetDetailsById(weddingId);
            if (wedding.IsSessionKeyExpired || wedding.IsSessionKeyExpired )
            {
                return null;
            }
            var sessionToken = wedding.SessionKey.ToString();

            //generating qr code
            using (var qrGenerator = new QRCodeGenerator())
            using (var qrCodeData = qrGenerator.CreateQrCode(sessionToken, QRCodeGenerator.ECCLevel.Q))
            using (var qrCode = new PngByteQRCode(qrCodeData))
            {
                byte[] qrCodeImage = qrCode.GetGraphic(20);
                return qrCodeImage; // returning qr-code as byte image
            }
        }

        public async Task<WeddingDTO> ValidateWeddingToken(Guid token)
        {
           var wedding = await _weddingRepository.ValidateSessionKeyAsync(token);
            if(wedding == null)
            {
                return null;
            }
           var weddingDTO = _mapper.Map<WeddingDTO>(wedding);
           return weddingDTO;
        }

    }
}
