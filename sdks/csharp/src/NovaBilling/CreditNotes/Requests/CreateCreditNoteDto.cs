using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateCreditNoteDto
{
    /// <summary>
    /// Invoice ID to credit against
    /// </summary>
    [JsonPropertyName("invoiceId")]
    public required string InvoiceId { get; set; }

    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Credit amount
    /// </summary>
    [JsonPropertyName("amount")]
    public required double Amount { get; set; }

    /// <summary>
    /// Currency
    /// </summary>
    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    [JsonPropertyName("reason")]
    public required CreateCreditNoteDtoReason Reason { get; set; }

    /// <summary>
    /// Additional metadata
    /// </summary>
    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <summary>
    /// Override status for imports
    /// </summary>
    [JsonPropertyName("status")]
    public CreateCreditNoteDtoStatus? Status { get; set; }

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
