using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GraduatedRangeDto : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    /// <summary>
    /// Start of range (inclusive)
    /// </summary>
    [JsonPropertyName("fromValue")]
    public required double FromValue { get; set; }

    /// <summary>
    /// End of range (inclusive), null = infinity
    /// </summary>
    [JsonPropertyName("toValue")]
    public double? ToValue { get; set; }

    /// <summary>
    /// Price per unit in this range
    /// </summary>
    [JsonPropertyName("perUnitAmount")]
    public required double PerUnitAmount { get; set; }

    /// <summary>
    /// Flat fee for entering this range
    /// </summary>
    [JsonPropertyName("flatAmount")]
    public double? FlatAmount { get; set; }

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
