using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdateChargeDto
{
    /// <summary>
    /// Charge ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    [JsonPropertyName("billingTiming")]
    public UpdateChargeDtoBillingTiming? BillingTiming { get; set; }

    [JsonPropertyName("invoiceDisplayName")]
    public string? InvoiceDisplayName { get; set; }

    [JsonPropertyName("minAmountCents")]
    public double? MinAmountCents { get; set; }

    [JsonPropertyName("prorated")]
    public bool? Prorated { get; set; }

    [JsonPropertyName("properties")]
    public Dictionary<string, object?>? Properties { get; set; }

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
