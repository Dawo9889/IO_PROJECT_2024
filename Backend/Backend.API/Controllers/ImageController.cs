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

            if (createImageDTO.ImageFile == null || createImageDTO.ImageFile.Length == 0)
            {
                return BadRequest("Należy przesłać dokładnie jeden plik.");
            }

            var result = await _imageService.AddImageAsync(createImageDTO, token);
            if (!result) { 
                return BadRequest();
            }

            return Ok("Photo saved");

        }

        [HttpGet("path")]
        public async Task<IActionResult> GetImagesForWedding([FromQuery] Guid weddingId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var images = await _imageService.GetImagesForWeddingAsync(weddingId, userId);
            if(images == null)
            {
                return Unauthorized("User does not have access to this wedding.");
            }

            return Ok(images);
        }

        [HttpGet("{weddingId}/{imageId}/thumbnail/{thumbnailFileName}")]
        public async Task<IActionResult> GetThumbnail(Guid weddingId, Guid imageId, string thumbnailFileName)
        {
            try
            {
                var thumbnailPath = Path.Combine(weddingId.ToString(), imageId.ToString(), "thumbnail", thumbnailFileName);
                var (fileStream, mimeType) =  _imageService.GetPhotoThumbnailFile(thumbnailPath);
                return new FileStreamResult(fileStream, mimeType);
            }
            catch (FileNotFoundException) 
            {
                return NotFound("Thumbnail not found.");
            }

        }

        [HttpGet("{weddingId}/{imageId}/originalPhoto/{originalPhotoName}")]
        public async Task<IActionResult> GetOriginalPhotot(Guid weddingId, Guid imageId, string originalPhotoName)
        {
            try
            {
                var originalPhotoPath = Path.Combine(weddingId.ToString(), imageId.ToString(), "originalPhoto", originalPhotoName);
                var (fileStream, mimeType) = _imageService.GetPhotoThumbnailFile(originalPhotoPath);
                return new FileStreamResult(fileStream, mimeType);
            }
            catch (FileNotFoundException)
            {
                return NotFound("OriginalPhoto not found.");
            }

        }

    }
}
