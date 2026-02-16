using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdateAddOnDto
{
    /// <summary>
    /// Add-on ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("invoiceDisplayName")]
    public string? InvoiceDisplayName { get; set; }

    [JsonPropertyName("prices")]
    public IEnumerable<AddOnPriceDto>? Prices { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
