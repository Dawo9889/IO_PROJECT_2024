using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.DTO.WeddingDTO
{
    public class WeddingDetailsDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public DateOnly EventDate { get; set; } = default!;
        public string Description { get; set; } = default!;
        public DateTime SessionKeyExpirationDate { get; set; } 
        public int ImagesCount { get; set; }
        public Guid SessionKey { get; set; }
    }
}
