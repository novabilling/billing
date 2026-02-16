using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreatePlanOverrideDto
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Plan ID
    /// </summary>
    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    /// <summary>
    /// Override plan prices: array of { currency, amount }
    /// </summary>
    [JsonPropertyName("overriddenPrices")]
    public IEnumerable<string>? OverriddenPrices { get; set; }

    /// <summary>
    /// Override minimum commitment amount
    /// </summary>
    [JsonPropertyName("overriddenMinimumCommitment")]
    public double? OverriddenMinimumCommitment { get; set; }

    /// <summary>
    /// Override charge properties: array of { chargeId, properties?, graduatedRanges? }
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
