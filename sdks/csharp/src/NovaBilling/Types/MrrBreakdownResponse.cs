using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record MrrBreakdownResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("totalMrr")]
    public required double TotalMrr { get; set; }

    [JsonPropertyName("newMrr")]
    public required double NewMrr { get; set; }

    [JsonPropertyName("expansionMrr")]
    public required double ExpansionMrr { get; set; }

    [JsonPropertyName("contractionMrr")]
    public required double ContractionMrr { get; set; }

    [JsonPropertyName("churnMrr")]
    public required double ChurnMrr { get; set; }

    [JsonPropertyName("netNewMrr")]
    public required double NetNewMrr { get; set; }

    [JsonPropertyName("byPlan")]
    public IEnumerable<MrrPlanBreakdown> ByPlan { get; set; } = new List<MrrPlanBreakdown>();

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
