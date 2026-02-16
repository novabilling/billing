using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CustomerAnalyticsResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("totalCustomers")]
    public required double TotalCustomers { get; set; }

    [JsonPropertyName("newCustomers")]
    public required double NewCustomers { get; set; }

    /// <summary>
    /// Average revenue per user
    /// </summary>
    [JsonPropertyName("arpu")]
    public required string Arpu { get; set; }

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
