using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record SubscriptionAnalyticsResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("total")]
    public required double Total { get; set; }

    [JsonPropertyName("active")]
    public required double Active { get; set; }

    [JsonPropertyName("canceled")]
    public required double Canceled { get; set; }

    [JsonPropertyName("trialing")]
    public required double Trialing { get; set; }

    [JsonPropertyName("paused")]
    public required double Paused { get; set; }

    [JsonPropertyName("newSubscriptions")]
    public required double NewSubscriptions { get; set; }

    /// <summary>
    /// Churn rate percentage
    /// </summary>
    [JsonPropertyName("churnRate")]
    public required string ChurnRate { get; set; }

    /// <summary>
    /// Retention rate percentage
    /// </summary>
    [JsonPropertyName("retentionRate")]
    public required string RetentionRate { get; set; }

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
