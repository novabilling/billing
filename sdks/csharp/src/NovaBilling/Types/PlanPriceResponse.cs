using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record PlanPriceResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    /// <summary>
    /// Decimal amount as string
    /// </summary>
    [JsonPropertyName("amount")]
    public required string Amount { get; set; }

    [JsonPropertyName("isActive")]
    public required bool IsActive { get; set; }

    [JsonPropertyName("createdAt")]
    public required string CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public required string UpdatedAt { get; set; }

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
