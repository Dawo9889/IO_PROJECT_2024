using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Services.Email
{
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string to, string subject, string body)
        {
            throw new NotImplementedException();
        }
    }
}
