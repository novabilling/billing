using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record LtvResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("avgLtv")]
    public required double AvgLtv { get; set; }

    [JsonPropertyName("avgLifespanDays")]
    public required double AvgLifespanDays { get; set; }

    [JsonPropertyName("byPlan")]
    public IEnumerable<LtvPlanBreakdown> ByPlan { get; set; } = new List<LtvPlanBreakdown>();

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
