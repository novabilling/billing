using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ChargeResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    [JsonPropertyName("billableMetricId")]
    public required string BillableMetricId { get; set; }

    [JsonPropertyName("chargeModel")]
    public required ChargeResponseChargeModel ChargeModel { get; set; }

    [JsonPropertyName("billingTiming")]
    public required ChargeResponseBillingTiming BillingTiming { get; set; }

    [JsonPropertyName("invoiceDisplayName")]
    public string? InvoiceDisplayName { get; set; }

    [JsonPropertyName("minAmountCents")]
    public double? MinAmountCents { get; set; }

    [JsonPropertyName("prorated")]
    public required bool Prorated { get; set; }

    /// <summary>
    /// Model-specific config
    /// </summary>
    [JsonPropertyName("properties")]
    public Dictionary<string, object?>? Properties { get; set; }

    [JsonPropertyName("graduatedRanges")]
    public IEnumerable<ChargeGraduatedRangeResponse> GraduatedRanges { get; set; } =
        new List<ChargeGraduatedRangeResponse>();

    [JsonPropertyName("filters")]
    public IEnumerable<ChargeFilterResponse> Filters { get; set; } =
        new List<ChargeFilterResponse>();

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
