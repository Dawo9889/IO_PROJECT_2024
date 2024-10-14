using Backend.Infrastructure.Persistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Seeders
{
    internal class DatabaseSeeder(APIDbContext dbContext)
    {
        public async Task Seed()
        {
            if(await dbContext.Database.CanConnectAsync())
            {
                if (!dbContext.Medias.Any())
                {
                    // tu seedowanie danych
                }
            }
        }
    }
}
