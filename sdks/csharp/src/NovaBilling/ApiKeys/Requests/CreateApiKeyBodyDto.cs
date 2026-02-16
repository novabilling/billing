using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateApiKeyBodyDto
{
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("scopes")]
    public IEnumerable<string> Scopes { get; set; } = new List<string>();

    [JsonPropertyName("expiresAt")]
    public string? ExpiresAt { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
