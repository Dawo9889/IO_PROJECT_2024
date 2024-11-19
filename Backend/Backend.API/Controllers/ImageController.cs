using Backend.Application.DTO.ImageDTO;
using Backend.Application.Services.Images;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.API.Controllers
{
    [Route("api/image")]
    [ApiController]
    [Authorize]
    public class ImageController : ControllerBase
    {
        private readonly InterfaceImageService _imageService;

        public ImageController(InterfaceImageService imageService)
        {
            _imageService = imageService;
        }


        [HttpPost("upload")]
        [AllowAnonymous]
        public async Task<ActionResult> Create([FromQuery] Guid token, [FromForm] CreateImageDTO createImageDTO)
        {
            var sessionValid = await _imageService.IsSessionValid(token);
            if (!sessionValid)
            {
                return Unauthorized("Token jest niewlasciwy lub niewazny");
            }

            if (createImageDTO == null || createImageDTO.ImageFile == null)
            {
                return BadRequest("Brak pliku w zapytaniu");
            }
            await _imageService.AddImageAsync(createImageDTO, token);

            return Ok("Photo saved");
        }

        [HttpGet]
        public async Task<IActionResult> GetImagesForWedding([FromQuery] Guid weddingId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var images = await _imageService.GetImagesForWeddingAsync(weddingId, userId);
            if(images == null)
            {
                return Forbid("User does not have access to this wedding.");
            }

            return Ok(images);
        }


    }
}
