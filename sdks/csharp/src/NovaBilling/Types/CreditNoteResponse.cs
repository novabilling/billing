using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreditNoteResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("invoiceId")]
    public required string InvoiceId { get; set; }

    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Decimal amount as string
    /// </summary>
    [JsonPropertyName("amount")]
    public required string Amount { get; set; }

    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    [JsonPropertyName("reason")]
    public required CreditNoteResponseReason Reason { get; set; }

    [JsonPropertyName("status")]
    public required CreditNoteResponseStatus Status { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    [JsonPropertyName("createdAt")]
    public required string CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public required string UpdatedAt { get; set; }

    [JsonIgnore]
    public ReadOnlyAdditionalProperties AdditionalProperties { get; private set; } = new();

    void IJsonOnDeserialized.OnDeserialized() =>
        AdditionalProperties.CopyFromExtensionData(_extensionData);

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
