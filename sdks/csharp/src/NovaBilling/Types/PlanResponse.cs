using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record PlanResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("code")]
    public required string Code { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("billingInterval")]
    public required PlanResponseBillingInterval BillingInterval { get; set; }

    [JsonPropertyName("features")]
    public IEnumerable<string>? Features { get; set; }

    [JsonPropertyName("isActive")]
    public required bool IsActive { get; set; }

    [JsonPropertyName("billingTiming")]
    public required PlanResponseBillingTiming BillingTiming { get; set; }

    /// <summary>
    /// Minimum commitment amount
    /// </summary>
    [JsonPropertyName("minimumCommitment")]
    public string? MinimumCommitment { get; set; }

    [JsonPropertyName("prices")]
    public IEnumerable<PlanPriceResponse> Prices { get; set; } = new List<PlanPriceResponse>();

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
