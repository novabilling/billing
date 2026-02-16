using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreatePlanDto
{
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Unique plan code (lowercase, underscores)
    /// </summary>
    [JsonPropertyName("code")]
    public required string Code { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("billingInterval")]
    public required CreatePlanDtoBillingInterval BillingInterval { get; set; }

    /// <summary>
    /// When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
    /// </summary>
    [JsonPropertyName("billingTiming")]
    public CreatePlanDtoBillingTiming? BillingTiming { get; set; }

    [JsonPropertyName("features")]
    public IEnumerable<string>? Features { get; set; }

    [JsonPropertyName("prices")]
    public IEnumerable<CreatePlanPriceDto>? Prices { get; set; }

    /// <summary>
    /// Net payment terms in days (overrides org default)
    /// </summary>
    [JsonPropertyName("netPaymentTerms")]
    public double? NetPaymentTerms { get; set; }

    /// <summary>
    /// Grace period in days before draft invoices are finalized
    /// </summary>
    [JsonPropertyName("invoiceGracePeriodDays")]
    public double? InvoiceGracePeriodDays { get; set; }

    /// <summary>
    /// Usage cost threshold for mid-cycle progressive billing invoices
    /// </summary>
    [JsonPropertyName("progressiveBillingThreshold")]
    public double? ProgressiveBillingThreshold { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
