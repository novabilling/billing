using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RemoveFromCustomerTaxesRequest
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonIgnore]
    public required string CustomerId { get; set; }

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
