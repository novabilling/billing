using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RefreshTokenDto
{
    /// <summary>
    /// Refresh token
    /// </summary>
    [JsonPropertyName("refreshToken")]
    public required string RefreshToken { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
