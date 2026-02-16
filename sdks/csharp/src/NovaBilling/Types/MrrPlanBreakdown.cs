using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record MrrPlanBreakdown : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    [JsonPropertyName("planName")]
    public required string PlanName { get; set; }

    [JsonPropertyName("mrr")]
    public required double Mrr { get; set; }

    [JsonPropertyName("subscriptionCount")]
    public required double SubscriptionCount { get; set; }

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
