using Backend.Infrastructure.Extensions;
using Backend.Infrastructure.Seeders;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
seeder.Seed().Wait();



app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
