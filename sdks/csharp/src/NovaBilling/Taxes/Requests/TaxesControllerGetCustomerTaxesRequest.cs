using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record TaxesControllerGetCustomerTaxesRequest
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonIgnore]
    public required string CustomerId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
