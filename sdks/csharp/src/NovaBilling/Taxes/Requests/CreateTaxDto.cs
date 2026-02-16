using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateTaxDto
{
    /// <summary>
    /// Tax name
    /// </summary>
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Unique tax code (lowercase, underscores)
    /// </summary>
    [JsonPropertyName("code")]
    public required string Code { get; set; }

    /// <summary>
    /// Tax rate as a percentage (e.g., 18 for 18%)
    /// </summary>
    [JsonPropertyName("rate")]
    public required double Rate { get; set; }

    /// <summary>
    /// Tax description
    /// </summary>
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    /// <summary>
    /// Whether this tax is applied by default to all invoices
    /// </summary>
    [JsonPropertyName("appliedByDefault")]
    public bool? AppliedByDefault { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
