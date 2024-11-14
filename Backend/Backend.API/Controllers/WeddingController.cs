using Backend.Application.DTO.WeddingDTO;
using Backend.Application.Services.Wedding;
using Backend.Domain;
using Backend.Domain.Entities;
using Backend.Infrastructure.Persistance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.API.Controllers
{
    [Route("api/wedding")]
    [ApiController]
    [Authorize]
    public class WeddingController : ControllerBase
    {
        private readonly IWeddingService _weddingService;
        public WeddingController(IWeddingService weddingService)
        {
            _weddingService = weddingService;   
        }


        //Gets

        [HttpGet]
        public async Task<List<WeddingDTO>> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var weddings = await _weddingService.GetAllWeddingsByUser(userId);
            return weddings;
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


        //Posts

        [HttpPost]
        public async Task<ActionResult> CreateWedding(WeddingDTO weddingDTO)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _weddingService.Create(weddingDTO, userId);
            return Ok(weddingDTO);
        }



        //Delete
        [HttpDelete]
        public async Task<ActionResult> DeleteWedding([FromQuery] Guid id)
        {
            var result = await _weddingService.Delete(id);

            if (result)
            {
                return NoContent();
            }

            return NotFound();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateWedding([FromBody] WeddingDTO newWeddingDTO)
        {
            if (newWeddingDTO.Id == Guid.Empty)
            {
                return BadRequest("Wedding ID is required.");
            }

            var success = await _weddingService.Update(newWeddingDTO);

            if (!success)
            {
                return NotFound("Wedding not found or update failed.");
            }

            return Ok(newWeddingDTO); 
        }

        [HttpPut("extend")]
        public async Task<IActionResult> ExtendSession([FromQuery] Guid id, [FromQuery] int hours)
        {
            var extended = await _weddingService.ExtendSessionKeyExpiration(id, TimeSpan.FromHours(hours));

            if (!extended)
            {
                return NotFound("Wesele nie zostało znalezione");
            }

            return Ok("Czas tokenu został wydłużony");
        }

        [HttpGet("token-qr")]
        public async Task <ActionResult> GetQRCodeForSession([FromQuery] Guid id)
        {
            var qrCode = await _weddingService.GetQrCode(id);
            if(qrCode == null)
            {
                return BadRequest("Something went wrong, token might be expired");
            }
            return File(qrCode, "image/png");
        }
    }
}
