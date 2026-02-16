using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdateProviderDto
{
    /// <summary>
    /// Payment provider ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Provider name
    /// </summary>
    [JsonPropertyName("providerName")]
    public string? ProviderName { get; set; }

    /// <summary>
    /// Provider credentials (will be encrypted)
    /// </summary>
    [JsonPropertyName("credentials")]
    public Dictionary<string, object?>? Credentials { get; set; }

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
