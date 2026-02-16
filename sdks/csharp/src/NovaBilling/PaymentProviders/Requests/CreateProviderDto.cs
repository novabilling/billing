using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateProviderDto
{
    /// <summary>
    /// Provider name
    /// </summary>
    [JsonPropertyName("providerName")]
    public required string ProviderName { get; set; }

    /// <summary>
    /// Provider credentials (will be encrypted)
    /// </summary>
    [JsonPropertyName("credentials")]
    public Dictionary<string, object?> Credentials { get; set; } =
        new Dictionary<string, object?>();

    [JsonPropertyName("isActive")]
    public bool? IsActive { get; set; }

    /// <summary>
    /// Priority (lower = higher)
    /// </summary>
    [JsonPropertyName("priority")]
    public double? Priority { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
