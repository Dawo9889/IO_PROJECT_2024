using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain
{
    public class Image
    {
        [Key]
        public Guid Id { get; set; }

        public string FilePath { get; set; } = default!;

        public string? Author { get; set; }

        // Klucz obcy do wesela (Many-to-One)
        public Guid WeddingId { get; set; }
        public Wedding Wedding { get; set; }
    }
}
