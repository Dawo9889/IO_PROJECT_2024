using Backend.Application.Services;
using Backend.Domain;
using Backend.Domain.Entities;
using Backend.Infrastructure.Persistance;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [Route("api/wedding")]
    [ApiController]
    public class WeddingController : ControllerBase
    {
        private readonly IWeddingService _weddingService;
        public WeddingController(IWeddingService weddingService)
        {
            _weddingService = weddingService;   
        }
        [HttpGet]
        public async Task<List<Wedding>> GetAll()
        {
            var weddings = await _weddingService.GetAllWeddings();
            return weddings;
        }

        [HttpPost]
        public async Task<IActionResult> CreateWedding(Wedding wedding)
        {
            await _weddingService.Create(wedding);
            return Ok(wedding);
        }
    }
}
