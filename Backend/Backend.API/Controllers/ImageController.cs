using Backend.Application.Services.Images;
using Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [Route("api/image")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly InterfaceImageService _imageService;

        public ImageController(InterfaceImageService imageService)
        {
            _imageService = imageService;
        }


        [HttpPost]
        public async Task<ActionResult> Create([FromQuery] Guid token)
        {
            var sessionValid = await _imageService.IsSessionValid(token);
            if (!sessionValid)
            {
                return Unauthorized("Token jest niewlasciwy lub niewazny");
            }

            //TODO Dodac logike do zdjec
            return Ok("Photo added");
        }
    }
}
