using Backend.Domain.Entities;

namespace Backend.Application.Services
{
    public interface IWeddingService
    {
        Task Create(Wedding wedding);
    }
}