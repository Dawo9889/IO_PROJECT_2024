using Microsoft.AspNetCore.Identity;

namespace Backend.API.Override
{
    public class CustomIdentityErrorDescriber : IdentityErrorDescriber
    {
        public override IdentityError DuplicateUserName(string userName)
        {
            return new IdentityError
            {
                Code = nameof(DuplicateUserName),
                Description = $"The email '{userName}' is already in use."
            };
        }
    }
}
