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
        [HttpGet("REMOVE_ME")]
        public async Task<List<WeddingDTO>> GetAllWeddings()
        {
            

            var weddings = await _weddingService.GetAllWeddings();
            return weddings;
        }

        [HttpGet]
        public async Task<List<WeddingDTO>> GetAllByUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var weddings = await _weddingService.GetAllWeddingsByUser(userId);
            return weddings;
        }

        [HttpGet("verifyToken")]
        public async Task<ActionResult<WeddingDTO>> VerifyWeddingToken([FromQuery] Guid token)
        {
            var weddingDTO = await _weddingService.ValidateWeddingToken(token);
            if (weddingDTO == null)
            {
                return NotFound();
            }
            return weddingDTO;
        }

        [HttpGet("details")]
        public async Task<ActionResult<WeddingDetailsDTO>> GetByID([FromQuery] Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var weddingDetailsDto = await _weddingService.GetWeddingDetailsById(id, userId);
            if(weddingDetailsDto == null)
            {
                return NotFound("Wedding not found");
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _weddingService.Delete(id, userId);

            if (result)
            {
                return NoContent();
            }

            return NotFound("Wedding not found");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateWedding([FromBody] WeddingDTO newWeddingDTO)
        {
            if (newWeddingDTO.Id == Guid.Empty)
            {
                return BadRequest("Wedding ID is required.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var success = await _weddingService.Update(newWeddingDTO, userId);

            if (!success)
            {
                return NotFound("Wedding not found or update failed.");
            }

            return Ok(newWeddingDTO); 
        }

        [HttpPut("updateToken")]
        public async Task<IActionResult> UpdateSession([FromQuery] Guid id, [FromQuery] int hours)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var extended = await _weddingService.UpdateSessionKeyExpiration(id, TimeSpan.FromHours(hours), userId);

            if (!extended)
            {
                return NotFound("Wedding could not be found");
            }

            return Ok("Expiration date extended");
        }

        [HttpGet("token-qr")]
        public async Task <ActionResult> GetQRCodeForSession([FromQuery] Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var qrCode = await _weddingService.GetQrCode(id, userId);
            if(qrCode == null)
            {
                return NotFound("Something went wrong, token might be expired");
            }
            return File(qrCode, "image/png");
        }
    }
}
