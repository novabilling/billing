using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdateTaxDto
{
    /// <summary>
    /// Tax ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("rate")]
    public double? Rate { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("appliedByDefault")]
    public bool? AppliedByDefault { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
