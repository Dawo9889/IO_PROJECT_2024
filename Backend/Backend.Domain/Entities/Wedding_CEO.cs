using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class Wedding_CEO
    {
        public Guid WeddingId { get; set; } // FK do wesela
        public Wedding Wedding { get; set; }

        public Guid AccountId { get; set; } 
        public Account Account { get; set; }
    }
}
