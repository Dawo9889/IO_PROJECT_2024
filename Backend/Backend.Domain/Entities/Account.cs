using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class Account : IdentityUser
    {
        
        public ICollection<WeddingAdmin>? WeddingAdmin { get; set; }

    }
}
