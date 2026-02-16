using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreatePaymentDto
{
    /// <summary>
    /// Invoice ID this payment is for
    /// </summary>
    [JsonPropertyName("invoiceId")]
    public required string InvoiceId { get; set; }

    /// <summary>
    /// Payment provider name (e.g. stripe, paystack, manual)
    /// </summary>
    [JsonPropertyName("provider")]
    public required string Provider { get; set; }

    /// <summary>
    /// Payment amount
    /// </summary>
    [JsonPropertyName("amount")]
    public required double Amount { get; set; }

    /// <summary>
    /// Currency
    /// </summary>
    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    /// <summary>
    /// Payment status
    /// </summary>
    [JsonPropertyName("status")]
    public required CreatePaymentDtoStatus Status { get; set; }

    /// <summary>
    /// Provider transaction ID
    /// </summary>
    [JsonPropertyName("providerTransactionId")]
    public string? ProviderTransactionId { get; set; }

    /// <summary>
    /// Failure reason (for FAILED payments)
    /// </summary>
    [JsonPropertyName("failureReason")]
    public string? FailureReason { get; set; }

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
