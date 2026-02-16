using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ChangePlanDto
{
    /// <summary>
    /// Subscription ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// New plan ID
    /// </summary>
    [JsonPropertyName("newPlanId")]
    public required string NewPlanId { get; set; }

    /// <summary>
    /// Whether to prorate charges
    /// </summary>
    [JsonPropertyName("prorate")]
    public bool? Prorate { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
