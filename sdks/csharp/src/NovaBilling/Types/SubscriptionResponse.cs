using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record SubscriptionResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("externalId")]
    public string? ExternalId { get; set; }

    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    [JsonPropertyName("previousPlanId")]
    public string? PreviousPlanId { get; set; }

    [JsonPropertyName("status")]
    public required SubscriptionResponseStatus Status { get; set; }

    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    [JsonPropertyName("billingTiming")]
    public required SubscriptionResponseBillingTiming BillingTiming { get; set; }

    [JsonPropertyName("currentPeriodStart")]
    public required string CurrentPeriodStart { get; set; }

    [JsonPropertyName("currentPeriodEnd")]
    public required string CurrentPeriodEnd { get; set; }

    [JsonPropertyName("cancelAt")]
    public string? CancelAt { get; set; }

    [JsonPropertyName("canceledAt")]
    public string? CanceledAt { get; set; }

    [JsonPropertyName("trialStart")]
    public string? TrialStart { get; set; }

    [JsonPropertyName("trialEnd")]
    public string? TrialEnd { get; set; }

    [JsonPropertyName("startedAt")]
    public required string StartedAt { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    [JsonPropertyName("customer")]
    public SubscriptionCustomerResponse? Customer { get; set; }

    [JsonPropertyName("plan")]
    public SubscriptionPlanResponse? Plan { get; set; }

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
