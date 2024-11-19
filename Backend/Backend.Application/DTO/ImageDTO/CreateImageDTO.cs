using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.DTO.ImageDTO
{
    public class CreateImageDTO
    {
        public Guid Id { get; set; }
        public IFormFile ImageFile { get; set; } = default!;
        public string? Author { get; set; }
        public Guid? WeddingID { get; set; }
    }
}
