using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RegisterDto
{
    /// <summary>
    /// Full name of the tenant owner
    /// </summary>
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    [JsonPropertyName("email")]
    public required string Email { get; set; }

    /// <summary>
    /// Password (min 8 characters)
    /// </summary>
    [JsonPropertyName("password")]
    public required string Password { get; set; }

    /// <summary>
    /// Company name (used to generate slug)
    /// </summary>
    [JsonPropertyName("companyName")]
    public required string CompanyName { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
