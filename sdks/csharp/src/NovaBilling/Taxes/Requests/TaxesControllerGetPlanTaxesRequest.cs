using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record TaxesControllerGetPlanTaxesRequest
{
    /// <summary>
    /// Plan ID
    /// </summary>
    [JsonIgnore]
    public required string PlanId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
