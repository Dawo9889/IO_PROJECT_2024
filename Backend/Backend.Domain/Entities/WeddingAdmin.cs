using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class WeddingAdmin
    {
        public Guid WeddingId { get; set; }
        public Wedding? Wedding { get; set; }

        public Guid? AccountId { get; set; }
        public Account? Account { get; set; }
    }

}
