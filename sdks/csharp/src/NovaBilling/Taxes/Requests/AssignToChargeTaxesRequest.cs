using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record AssignToChargeTaxesRequest
{
    /// <summary>
    /// Charge ID
    /// </summary>
    [JsonIgnore]
    public required string ChargeId { get; set; }

    [JsonIgnore]
    public required AssignTaxDto Body { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
