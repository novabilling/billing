using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RemoveFromPlanTaxesRequest
{
    /// <summary>
    /// Plan ID
    /// </summary>
    [JsonIgnore]
    public required string PlanId { get; set; }

    /// <summary>
    /// Tax ID
    /// </summary>
    [JsonIgnore]
    public required string TaxId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
