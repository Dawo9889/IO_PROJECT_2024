using Backend.Application.Mappings;
using Backend.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IWeddingService, WeddingService>();


            //AutoMapper
            services.AddAutoMapper(typeof(WeddingMappingProfile));
        }


    }
}
