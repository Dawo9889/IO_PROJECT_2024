using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.DTO.ImageDTO
{
    public class ImagesDataDTO
    {
        public Guid Id { get; set; }

        public string FilePath { get; set; } = default!;
        public DateTime CreatedAt { get; set; }

        public string ThumbnailPath { get; set; } = default!;

        public string? Author { get; set; }

        [MaxLength(100)]
        public string? Description { get; set; }
    }
}
