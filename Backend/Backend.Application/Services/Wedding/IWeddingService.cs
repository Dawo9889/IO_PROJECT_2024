using Backend.Application.DTO.WeddingDTO;
using Backend.Domain.Entities;

namespace Backend.Application.Services.Wedding
{
    public interface IWeddingService
    {
        Task Create(WeddingDTO weddingDTO);
        Task<List<WeddingDTO>> GetAllWeddings();

        Task<WeddingDetailsDTO> GetWeddingDetailsById(Guid id);

        Task<bool> Delete(Guid id);

        Task<bool> Update(WeddingDTO newWeddingDTO);

        Task<bool> ExtendSessionKeyExpiration(Guid weddingId, TimeSpan extensionDuration);

    }
}