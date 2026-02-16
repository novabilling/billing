using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ResetPasswordDto
{
    /// <summary>
    /// Password reset token
    /// </summary>
    [JsonPropertyName("token")]
    public required string Token { get; set; }

    /// <summary>
    /// New password (min 8 characters)
    /// </summary>
    [JsonPropertyName("newPassword")]
    public required string NewPassword { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
