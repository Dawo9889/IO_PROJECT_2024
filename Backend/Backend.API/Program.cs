using Backend.API.Extensions;
using Backend.Application.Extensions;
using Backend.Domain.Entities;
using Backend.Infrastructure.Extensions;
using Backend.Infrastructure.Seeders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



builder.AddPresentation();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        // ufamy temu adresowi, niezele¿nie od nag³ówka lub metody (POST, PUT, etc.)
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:3000");
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:8081");
    });
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//seedowanie danych, jezeli nie istniej¹ 
var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
// seeder.Seed().Wait();


//identity
app.MapGroup("api/identity").MapIdentityApi<Account>();
app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();
