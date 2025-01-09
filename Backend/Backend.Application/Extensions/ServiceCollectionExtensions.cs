using Backend.Application.Mappings;
using Backend.Application.Services.Email;
using Backend.Application.Services.Images;
using Backend.Application.Services.User;
using Backend.Application.Services.Wedding;
using Backend.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IWeddingService, WeddingService>();
            services.AddScoped<InterfaceImageService, ImageService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IUserService, UserService>();

            //AutoMapper
            services.AddAutoMapper(typeof(WeddingMappingProfile));
            services.AddAutoMapper(typeof(ImageMappingProfile));
        }


    }
}
