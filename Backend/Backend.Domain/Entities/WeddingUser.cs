using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class WeddingUser
    {
        public Guid WeddingId { get; set; }
        public Wedding? Wedding { get; set; }

        public string UserId { get; set; }
        public User? User { get; set; }
    }

}
