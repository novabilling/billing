using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record PaymentAnalyticsResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("totalPayments")]
    public required double TotalPayments { get; set; }

    [JsonPropertyName("succeeded")]
    public required double Succeeded { get; set; }

    [JsonPropertyName("failed")]
    public required double Failed { get; set; }

    [JsonPropertyName("pending")]
    public required double Pending { get; set; }

    /// <summary>
    /// Success rate percentage
    /// </summary>
    [JsonPropertyName("successRate")]
    public required string SuccessRate { get; set; }

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
