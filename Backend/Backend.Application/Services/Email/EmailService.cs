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
            var fromEmail = "no-reply@cupid.pics";
            var mailMessage = new MailMessage(fromEmail, to, subject, body);

            var smtpClient = new SmtpClient("smtp.resend.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("resend", _smtpPassword),
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
