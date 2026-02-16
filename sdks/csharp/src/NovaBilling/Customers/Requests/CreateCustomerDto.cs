using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateCustomerDto
{
    /// <summary>
    /// Tenant's user ID
    /// </summary>
    [JsonPropertyName("externalId")]
    public required string ExternalId { get; set; }

    [JsonPropertyName("email")]
    public required string Email { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("country")]
    public string? Country { get; set; }

    /// <summary>
    /// ISO currency code
    /// </summary>
    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    /// <summary>
    /// Custom metadata
    /// </summary>
    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <summary>
    /// Net payment terms in days (overrides org and plan defaults)
    /// </summary>
    [JsonPropertyName("netPaymentTerms")]
    public double? NetPaymentTerms { get; set; }

    /// <summary>
    /// Backdate createdAt (ISO 8601). For data imports.
    /// </summary>
    [JsonPropertyName("createdAt")]
    public string? CreatedAt { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
