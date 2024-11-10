using Backend.Domain.Interfaces;
using Backend.Infrastructure.Persistance;
using Backend.Infrastructure.Repositories;
using Backend.Infrastructure.Seeders;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

            //Dodanie scope'u dla seedu
            services.AddScoped<DatabaseSeeder>();
            //scope dla repozytoriów
            services.AddScoped<IWeddingRepository, WeddingRepository>();
            services.AddScoped<InterfaceImageRepository, ImageRepository>();



        }
    }
}
