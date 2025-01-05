using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
namespace Backend.Application.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpPassword;
        public EmailService(IConfiguration configuration)
        {
            _smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
        }
        public Task SendEmailAsync(string to, string subject, string body)
        {
            Console.WriteLine($"Smtp Password: {_smtpPassword}");
            var fromEmail = "MS_wy7blF@trial-7dnvo4dxpk9g5r86.mlsender.net";
            var mailMessage = new MailMessage(fromEmail, to, subject, body);

            var smtpClient = new SmtpClient("smtp.mailersend.net")
            {
                Port = 587,
                Credentials = new NetworkCredential("MS_wy7blF@trial-7dnvo4dxpk9g5r86.mlsender.net", _smtpPassword),
                EnableSsl = true
            };
            try
            {
             
                smtpClient.Send(mailMessage);
                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
              
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
            return Task.CompletedTask;
        }
    }
}
