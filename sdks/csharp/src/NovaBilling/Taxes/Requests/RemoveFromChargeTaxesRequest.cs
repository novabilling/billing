using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RemoveFromChargeTaxesRequest
{
    /// <summary>
    /// Charge ID
    /// </summary>
    [JsonIgnore]
    public required string ChargeId { get; set; }

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
