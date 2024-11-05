using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class Account
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        public ICollection<Wedding_CEO> Wedding_CEOs { get; set; } = new List<Wedding_CEO>();

    }
}
