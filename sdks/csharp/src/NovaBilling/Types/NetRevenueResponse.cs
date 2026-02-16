using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record NetRevenueResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("grossRevenue")]
    public required double GrossRevenue { get; set; }

    [JsonPropertyName("refunds")]
    public required double Refunds { get; set; }

    [JsonPropertyName("creditNotes")]
    public required double CreditNotes { get; set; }

    [JsonPropertyName("netRevenue")]
    public required double NetRevenue { get; set; }

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
