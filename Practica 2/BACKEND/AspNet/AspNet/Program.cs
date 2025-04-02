
using AspNet.Data;
using Microsoft.EntityFrameworkCore;

namespace AspNet
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            builder.Services.AddControllers();
  
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseMySql(
                        builder.Configuration.GetConnectionString("DefaultConnection"),
                        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
                        o => o.EnableRetryOnFailure()
                );
            });

            if (builder.Environment.IsProduction())
            {
                builder.WebHost.UseUrls("http://*:3001");
            }

            var app = builder.Build();

            app.UseCors("AllowAll");
            app.MapControllers();

            app.Run();
        }
    }
}
