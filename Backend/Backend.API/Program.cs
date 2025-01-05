using Backend.API.Extensions;
using Backend.Application.Extensions;
using Backend.Domain.Entities;
using Backend.Infrastructure.Extensions;
using Backend.Infrastructure.Seeders;

var builder = WebApplication.CreateBuilder(args);

var env = Environment.GetEnvironmentVariable("DATABASE_IP");

var dockerConnection = builder.Configuration["ConnectionStrings:DockerConnection"];

if (!string.IsNullOrEmpty(env))
{
    dockerConnection = dockerConnection.Replace("{DATABASE_IP}", env);
}
else
{
    dockerConnection = dockerConnection.Replace("{DATABASE_IP}", "localhost");
}
builder.Configuration["ConnectionStrings:DockerConnection"] = dockerConnection;

// Add services to the container.
builder.AddPresentation();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});


var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Seed data if not exist
var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
seeder.Seed().Wait();


//identity
//app.MapGroup("api/identity").MapIdentityApi<User>();

//app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");
app.UseAuthorization();

app.MapControllers();

app.Run();