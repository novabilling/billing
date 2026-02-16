using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record LtvPlanBreakdown : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    [JsonPropertyName("planName")]
    public required string PlanName { get; set; }

    [JsonPropertyName("avgLtv")]
    public required double AvgLtv { get; set; }

    [JsonPropertyName("avgLifespanDays")]
    public required double AvgLifespanDays { get; set; }

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
