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
using static System.Formats.Asn1.AsnWriter;
namespace Backend.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DbConnection");
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

            //Dodanie scope'u dla seedu
            services.AddScoped<DatabaseSeeder>();
            //scope dla repozytoriów
            services.AddScoped<IWeddingRepository, WeddingRepository>();
            services.AddScoped<InterfaceImageRepository, ImageRepository>();
            //using (var serviceProvider = services.BuildServiceProvider())
            //{
            //    using (var scope = serviceProvider.CreateScope())
            //    {
            //        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            //        context.Database.Migrate(); // Creating migration if doesnt exist on a database
            //    }
            //}
        }
    }
}