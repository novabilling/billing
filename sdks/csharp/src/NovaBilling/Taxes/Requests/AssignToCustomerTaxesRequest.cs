using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record AssignToCustomerTaxesRequest
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonIgnore]
    public required string CustomerId { get; set; }

    [JsonIgnore]
    public required AssignTaxDto Body { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
