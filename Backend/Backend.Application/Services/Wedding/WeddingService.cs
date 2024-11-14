using AutoMapper;
using Backend.Application.DTO.WeddingDTO;
using Backend.Domain.Interfaces;
using Backend.Domain.Entities;
using QRCoder;


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
                var weddingFolderPath = Path.Combine(_photosBasePath, weddingDTO.Name + "_" + weddingDTO.EventDate);

                if (!Directory.Exists(weddingFolderPath))
                {
                    Directory.CreateDirectory(weddingFolderPath);
                }
            }
            else
            {
                throw new Exception("Blad zapisu");
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

        public async Task<WeddingDetailsDTO> GetWeddingDetailsById(Guid id)
        {
            var wedding = await _weddingRepository.GetDetailsById(id);
            var weddingDetailsDTO = _mapper.Map<WeddingDetailsDTO>(wedding);
            return weddingDetailsDTO;
        }


        public async Task<bool> Delete(Guid id)
        {
            return await _weddingRepository.DeleteWeedingById(id);
        }


        public async Task<bool> Update(WeddingDTO newWeddingDTO)
        {
            var oldWedding = await _weddingRepository.GetDetailsById(newWeddingDTO.Id);

            if (oldWedding == null)
            {
                return false;
            }

            var updatedWedding = _mapper.Map(newWeddingDTO, oldWedding);

            var updateSuccess = await _weddingRepository.Update(oldWedding);
            return updateSuccess;
        }

        public async Task<bool> ExtendSessionKeyExpiration(Guid Id, TimeSpan extensionDuration)
        {
            var wedding = await _weddingRepository.GetDetailsById(Id);

            if (wedding == null)
            {
                return false; 
            }

            // Aktualizacja daty wygaśnięcia klucza sesji
            wedding.SessionKeyExpirationDate = DateTime.UtcNow.Add(extensionDuration);
            await _weddingRepository.Update(wedding);

            return true; 
        }




        public async Task<byte[]> GetQrCode(Guid weddingId)
        {
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

      
    }
}
