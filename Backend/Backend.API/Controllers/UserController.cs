using Azure.Core;
using Backend.Application.Services.Email;
using Backend.Domain.Entities;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IdentityModel.Client;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Backend.Application.DTO.UserDTO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

[ApiController]
[Route("api/identity")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public UserController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration,
        IEmailService emailService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _emailService = emailService;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            EmailConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        var confirmationLink = Url.Action(nameof(ConfirmEmail), "User",
            new { userId = user.Id, token }, protocol: "https", host: "api.cupid.pics");

        var emailHtml = new HtmlMessageBuilder()
            .SetTitle("Confirm Your Email")
            .SetBody("Thank you for registering! Click the button below to confirm your email.")
            .SetButton("Confirm Email", confirmationLink)
            .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
            .Build();

        await _emailService.SendEmailAsync(user.Email, "Confirm your email to your Cupid App Account", emailHtml);

        return Ok($"Confirm your email that we sent to your email address.");
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            var notFound = new HtmlMessageBuilder()
                .SetTitle("User not found")
                .SetBody("Your request was not processed successfully.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();
            return Content(notFound, "text/html");
        }
           

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded)
        {
            var badRequest = new HtmlMessageBuilder()
                .SetTitle("Something went wrong")
                .SetBody("Your request was not processed successfully.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();
            return Content(badRequest, "text/html");
        }
           

        var statusHtml = new HtmlMessageBuilder()
            .SetTitle("Operation Successful")
            .SetBody("Your email has been confirmed successfully.")
            .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
            .Build();

        return Content(statusHtml, "text/html");
    }
    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationEmailRequest model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return NotFound("User not found");

        if(await _userManager.IsEmailConfirmedAsync(user))
        {
            return BadRequest("Email is already confirmed");
        }

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        var confirmationLink = Url.Action(nameof(ConfirmEmail), "User",
            new { userId = user.Id, token }, protocol: "https", host: "api.cupid.pics");
        var emailHtml = new HtmlMessageBuilder()
            .SetTitle("Confirm Your Email")
            .SetBody("Thank you for registering! Click the button below to confirm your email.")
            .SetButton("Confirm Email", confirmationLink)
            .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
            .Build();

        await _emailService.SendEmailAsync(user.Email, "Resend Confirmation Email for Your Cupid App Account", emailHtml);

        return Ok("Confirmation email has been resent. Please check your inbox.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized("Invalid email or password.");

        if (!await _userManager.IsEmailConfirmedAsync(user))
            return Unauthorized("Email not confirmed.");

        var accessToken = await GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            tokenType = "Bearer",
            accessToken,
            refreshToken,
            expiresIn = 3600
        });
    }


    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Invalid token.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found.");

        var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { errors });
        }

        return Ok("Password changed successfully.");
    }



    [HttpPost("refresh-token")]
    [Authorize]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDTO request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Unauthorized("Invalid user ID.");


        if (user.RefreshToken != request.refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return Unauthorized("Invalid or expired refresh token.");


        var newAccessToken = await GenerateJwtToken(user);


        var newRefreshToken = GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(2); 
        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            tokenType = "Bearer",
            accessToken = newAccessToken,
            refreshToken = newRefreshToken,
            expiresIn = 3600 
        });
    }


    [HttpPost("change-email")]

    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequestDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Invalid token.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found.");

        if (user.Email == model.NewEmail)
            return BadRequest("The new email address is the same as the current email.");

        var existingUser = await _userManager.FindByEmailAsync(model.NewEmail);
        if (existingUser != null)
            return BadRequest("This email address is already in use.");

        var token = await _userManager.GenerateChangeEmailTokenAsync(user, model.NewEmail);
        var confirmationLink = Url.Action(nameof(ConfirmChangeEmail), "User",
            new { token, newEmail = model.NewEmail, userId}, protocol: "https", host: "api.cupid.pics");

        var emailHtml = new HtmlMessageBuilder()
            .SetTitle("Confirm Your Email")
            .SetBody("There was a request to change your email address. Please confirm your new email by clicking the button below.")
            .SetButton("Confirm Email", confirmationLink)
            .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
            .Build();

        await _emailService.SendEmailAsync(model.NewEmail, "Confirm your new email address to Your Cupid account.", emailHtml);

        return Ok("A confirmation email has been sent to your new email address. ");

    }

    [HttpGet("confirm-change-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmChangeEmail(string token, string newEmail, string userId)
    {
        if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(newEmail) || string.IsNullOrEmpty(userId))
        {
            var errorHtml = new HtmlMessageBuilder()
                .SetTitle("Invalid Request")
                .SetBody("The request is invalid. Please make sure the token, new email, and user ID are provided correctly.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();

            return Content(errorHtml, "text/html");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            var errorHtml = new HtmlMessageBuilder()
                .SetTitle("User Not Found")
                .SetBody("We could not find a user matching the provided information.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();

            return Content(errorHtml, "text/html");
        }

        var result = await _userManager.ChangeEmailAsync(user, newEmail, token);
        if (!result.Succeeded)
        {
            var errorHtml = new HtmlMessageBuilder()
                .SetTitle("Email Change Failed")
                .SetBody("We encountered an issue while confirming your email change. Please try again or contact support.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();

            return Content(errorHtml, "text/html");
        }

        var successHtml = new HtmlMessageBuilder()
            .SetTitle("Email Changed Successfully")
            .SetBody("Your email address has been successfully updated. Thank you for keeping your profile up-to-date!")
            .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
            .Build();

        return Content(successHtml, "text/html");
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrEmpty(request.Email))
            return BadRequest("Email is required.");

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return BadRequest("User not found.");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var encodedToken = Uri.EscapeDataString(token);

        var resetLink = $"https:/app.cupid.pics/resetPasswordForm?email={request.Email}&token={token}";

        var emailHtml = new HtmlMessageBuilder()
        .SetTitle("Reset Your Password")
        .SetBody("We received a request to reset your password. If you made this request, click the button below to reset your password. If you didn’t request this, you can safely ignore this email.")
        .SetButton("Reset Password", resetLink)
        .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
        .Build();

        await _emailService.SendEmailAsync(request.Email, "Reset Your Password", emailHtml);

        return Ok("We have sent you an email with instructions to reset your password.");
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromQuery] string email, [FromQuery] string token, [FromBody] ResetPasswordRequestDTO request)
    {
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(token) || string.IsNullOrEmpty(request.newPassword))
        {
            var errorHtml = new HtmlMessageBuilder()
                .SetTitle("Invalid Request")
                .SetBody("Invalid request. Please ensure that you provide a valid email, token, and new password.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();

            return Content(errorHtml, "text/html");
        }

        var decodedToken = Uri.UnescapeDataString(token);
        token = token.Replace(" ", "+").Replace("\t", "+").Replace("\n", "+").Replace("\r", "+");

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            var errorHtml = new HtmlMessageBuilder()
                .SetTitle("User Not Found")
                .SetBody("We could not find a user associated with this email address. Please check your email and try again.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();

            return Content(errorHtml, "text/html");
        }

        var result = await _userManager.ResetPasswordAsync(user, token, request.newPassword);
        if (!result.Succeeded)
        {
            var errorHtml = new HtmlMessageBuilder()
                .SetTitle("Password Reset Failed")
                .SetBody("We encountered an issue while resetting your password. Please make sure your token is valid and try again.")
                .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
                .Build();

            return Content(errorHtml, "text/html");
        }

        var successHtml = new HtmlMessageBuilder()
            .SetTitle("Password Reset Successful")
            .SetBody("Your password has been successfully reset. You can now log in with your new password.")
            .SetFooter("&copy; 2025 Cupid Wedding App. All rights reserved.")
            .Build();

        return Content(successHtml, "text/html");
    }



    [HttpPost("upload-profile-picture")]
    [Authorize]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest("Invalid file type. Please upload an image.");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Invalid token.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found.");

        byte[] resizedImage;
        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);


            memoryStream.Seek(0, SeekOrigin.Begin);
            using (var image = SixLabors.ImageSharp.Image.Load(memoryStream))
            {

                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new SixLabors.ImageSharp.Size(400, 400)
                }));


                using (var outputStream = new MemoryStream())
                {
                    image.Save(outputStream, new JpegEncoder());
                    resizedImage = outputStream.ToArray();
                }
            }
        }

        user.ProfilePicture = resizedImage;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("Profile picture uploaded successfully.");
    }


    [HttpGet("profile-picture")]
    [Authorize]
    public async Task<IActionResult> GetProfilePicture()
    {

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Invalid token.");


        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found.");


        if (user.ProfilePicture == null || user.ProfilePicture.Length == 0)
            return NotFound("No profile picture found.");


        return File(user.ProfilePicture, "image/jpeg"); 
    }



    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);

    
        var base64String = Convert.ToBase64String(randomNumber);


        return base64String
            .Replace('+', '-')  
            .Replace('/', '_')  
            .TrimEnd('=');
    }
    private async Task<string> GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var jwtSettings = _configuration.GetSection("Jwt");
        var secretKey = jwtSettings["Key"];
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = signingCredentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
