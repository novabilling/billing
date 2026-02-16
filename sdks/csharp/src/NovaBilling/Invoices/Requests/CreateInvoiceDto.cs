using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateInvoiceDto
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Subscription ID (optional)
    /// </summary>
    [JsonPropertyName("subscriptionId")]
    public string? SubscriptionId { get; set; }

    [JsonPropertyName("items")]
    public IEnumerable<InvoiceItemDto> Items { get; set; } = new List<InvoiceItemDto>();

    /// <summary>
    /// Due date
    /// </summary>
    [JsonPropertyName("dueDate")]
    public required string DueDate { get; set; }

    /// <summary>
    /// Override invoice status for imports
    /// </summary>
    [JsonPropertyName("status")]
    public CreateInvoiceDtoStatus? Status { get; set; }

    /// <summary>
    /// Override invoice number (e.g. INV-00042). Auto-generated if omitted.
    /// </summary>
    [JsonPropertyName("invoiceNumber")]
    public string? InvoiceNumber { get; set; }

    /// <summary>
    /// Currency override (defaults to customer currency)
    /// </summary>
    [JsonPropertyName("currency")]
    public string? Currency { get; set; }

    /// <summary>
    /// Paid at date (ISO 8601). For importing paid invoices.
    /// </summary>
    [JsonPropertyName("paidAt")]
    public string? PaidAt { get; set; }

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
