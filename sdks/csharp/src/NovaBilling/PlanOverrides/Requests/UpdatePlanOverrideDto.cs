using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdatePlanOverrideDto
{
    /// <summary>
    /// Plan override ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Override plan prices
    /// </summary>
    [JsonPropertyName("overriddenPrices")]
    public IEnumerable<string>? OverriddenPrices { get; set; }

    /// <summary>
    /// Override minimum commitment amount
    /// </summary>
    [JsonPropertyName("overriddenMinimumCommitment")]
    public double? OverriddenMinimumCommitment { get; set; }

    /// <summary>
    /// Override charge properties
    /// </summary>
    [JsonPropertyName("overriddenCharges")]
    public IEnumerable<string>? OverriddenCharges { get; set; }

    /// <summary>
    /// Custom metadata
    /// </summary>
    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
