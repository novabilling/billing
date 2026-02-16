using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateChargeDto
{
    /// <summary>
    /// Plan ID to attach this charge to
    /// </summary>
    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    /// <summary>
    /// Billable metric ID
    /// </summary>
    [JsonPropertyName("billableMetricId")]
    public required string BillableMetricId { get; set; }

    [JsonPropertyName("chargeModel")]
    public required CreateChargeDtoChargeModel ChargeModel { get; set; }

    [JsonPropertyName("billingTiming")]
    public CreateChargeDtoBillingTiming? BillingTiming { get; set; }

    /// <summary>
    /// Display name on invoices
    /// </summary>
    [JsonPropertyName("invoiceDisplayName")]
    public string? InvoiceDisplayName { get; set; }

    /// <summary>
    /// Minimum charge in cents
    /// </summary>
    [JsonPropertyName("minAmountCents")]
    public double? MinAmountCents { get; set; }

    [JsonPropertyName("prorated")]
    public bool? Prorated { get; set; }

    /// <summary>
    /// Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
    /// </summary>
    [JsonPropertyName("properties")]
    public Dictionary<string, object?>? Properties { get; set; }

    /// <summary>
    /// Required for GRADUATED and VOLUME charge models
    /// </summary>
    [JsonPropertyName("graduatedRanges")]
    public IEnumerable<GraduatedRangeDto>? GraduatedRanges { get; set; }

    [JsonPropertyName("filters")]
    public IEnumerable<ChargeFilterDto>? Filters { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
