using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [MaxLength(100)]
        public string? Description { get; set; }
        public Guid? WeddingID { get; set; }
    }
}
