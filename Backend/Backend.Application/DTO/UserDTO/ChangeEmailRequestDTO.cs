using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.DTO.UserDTO
{
    public class ChangeEmailRequestDTO
    {

        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }
    }
}
