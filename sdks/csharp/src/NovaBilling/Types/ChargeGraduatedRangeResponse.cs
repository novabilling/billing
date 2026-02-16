using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ChargeGraduatedRangeResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("chargeId")]
    public required string ChargeId { get; set; }

    [JsonPropertyName("fromValue")]
    public required double FromValue { get; set; }

    [JsonPropertyName("toValue")]
    public double? ToValue { get; set; }

    /// <summary>
    /// Per-unit amount as decimal string
    /// </summary>
    [JsonPropertyName("perUnitAmount")]
    public required string PerUnitAmount { get; set; }

    /// <summary>
    /// Flat fee for this range
    /// </summary>
    [JsonPropertyName("flatAmount")]
    public required string FlatAmount { get; set; }

    [JsonPropertyName("order")]
    public required double Order { get; set; }

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
