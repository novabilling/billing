using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RevenueAnalyticsResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    /// <summary>
    /// Total revenue as decimal string
    /// </summary>
    [JsonPropertyName("totalRevenue")]
    public required string TotalRevenue { get; set; }

    [JsonPropertyName("invoiceCount")]
    public required double InvoiceCount { get; set; }

    /// <summary>
    /// Monthly recurring revenue
    /// </summary>
    [JsonPropertyName("mrr")]
    public required string Mrr { get; set; }

    /// <summary>
    /// Annual recurring revenue
    /// </summary>
    [JsonPropertyName("arr")]
    public required string Arr { get; set; }

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
