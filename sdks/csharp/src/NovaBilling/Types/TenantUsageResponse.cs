using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record TenantUsageResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("customers")]
    public required double Customers { get; set; }

    [JsonPropertyName("activeSubscriptions")]
    public required double ActiveSubscriptions { get; set; }

    [JsonPropertyName("totalInvoices")]
    public required double TotalInvoices { get; set; }

    [JsonPropertyName("totalRevenue")]
    public required string TotalRevenue { get; set; }

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
