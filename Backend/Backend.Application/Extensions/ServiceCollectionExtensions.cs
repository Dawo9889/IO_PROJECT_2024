﻿using Backend.Application.Mappings;
using Backend.Application.Services.Images;
using Backend.Application.Services.Wedding;
using Backend.Domain.Interfaces;
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
            services.AddScoped<InterfaceImageService, ImageService>();
            

            //AutoMapper
            services.AddAutoMapper(typeof(WeddingMappingProfile));
            services.AddAutoMapper(typeof(ImageMappingProfile));
        }


    }
}
