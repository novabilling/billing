using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdatePlanDto
{
    /// <summary>
    /// Plan ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("billingInterval")]
    public UpdatePlanDtoBillingInterval? BillingInterval { get; set; }

    /// <summary>
    /// When to charge: IN_ADVANCE or IN_ARREARS
    /// </summary>
    [JsonPropertyName("billingTiming")]
    public UpdatePlanDtoBillingTiming? BillingTiming { get; set; }

    [JsonPropertyName("features")]
    public IEnumerable<string>? Features { get; set; }

    [JsonPropertyName("isActive")]
    public bool? IsActive { get; set; }

    /// <summary>
    /// Net payment terms in days
    /// </summary>
    [JsonPropertyName("netPaymentTerms")]
    public double? NetPaymentTerms { get; set; }

    /// <summary>
    /// Grace period in days before draft invoices are finalized
    /// </summary>
    [JsonPropertyName("invoiceGracePeriodDays")]
    public double? InvoiceGracePeriodDays { get; set; }

    /// <summary>
    /// Usage cost threshold for progressive billing
    /// </summary>
    [JsonPropertyName("progressiveBillingThreshold")]
    public double? ProgressiveBillingThreshold { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
