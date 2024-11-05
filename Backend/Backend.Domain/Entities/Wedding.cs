using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Backend.Domain.Entities
{
    public class Wedding
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime EventDate { get; set; } = default!;

        [MaxLength(200)]
        public string Description { get; set; } = default!;


        // Relacja: Jedno wesele ma wiele zdjęć
        public virtual ICollection<Image?> Images { get; set; }
        // Relacja Jedno wesele ma wielu adminow
        public ICollection<Wedding_CEO> Wedding_CEOs { get; set; }
    }
}
