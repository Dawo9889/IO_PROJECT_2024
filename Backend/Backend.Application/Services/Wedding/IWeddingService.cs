using Backend.Application.DTO.WeddingDTO;
using Backend.Domain.Entities;

namespace Backend.Application.Services.Wedding
{
    public interface IWeddingService
    {
        Task Create(WeddingDTO weddingDTO, string userId);
        Task<List<WeddingDTO>> GetAllWeddings();

        Task<List<WeddingDTO>> GetAllWeddingsByUser(string userID);

        Task<WeddingDetailsDTO> GetWeddingDetailsById(Guid id, string userId);

        Task<bool> Delete(Guid id, string userId);

        Task<bool> Update(WeddingDTO newWeddingDTO, string UserId);

        Task<bool> UpdateSessionKeyExpiration(Guid weddingId, TimeSpan extensionDuration, string userId);

        Task<byte[]> GetQrCode(Guid weddingId, string userId);


        Task<WeddingDTO> ValidateWeddingToken(Guid token);

        bool DeleteAllWeddingsImageOnPath(Guid weddingId);


    }
}