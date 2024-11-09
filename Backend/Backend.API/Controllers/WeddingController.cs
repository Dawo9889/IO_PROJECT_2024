using Backend.Application.DTO.WeddingDTO;
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
        public async Task<List<WeddingDTO>> GetAll()
        {
            var weddings = await _weddingService.GetAllWeddings();
            return weddings;
        }

        [HttpPost]
        public async Task<ActionResult> CreateWedding(WeddingDTO weddingDTO)
        {
            await _weddingService.Create(weddingDTO);
            return Ok(weddingDTO);
        }


        [HttpGet("details")]
        public async Task<ActionResult<WeddingDetailsDTO>> GetByID([FromQuery] Guid id)
        {
            var weddingDetailsDto = await _weddingService.GetWeddingDetailsById(id);
            if(weddingDetailsDto == null)
            {
                return NotFound();
            }
            return Ok(weddingDetailsDto);
        }


    }
}
