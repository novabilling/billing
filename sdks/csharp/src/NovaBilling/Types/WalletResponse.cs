using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record WalletResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    /// <summary>
    /// 1 credit = rateAmount in currency
    /// </summary>
    [JsonPropertyName("rateAmount")]
    public required string RateAmount { get; set; }

    /// <summary>
    /// Available credits
    /// </summary>
    [JsonPropertyName("creditsBalance")]
    public required string CreditsBalance { get; set; }

    /// <summary>
    /// Monetary equivalent of credits
    /// </summary>
    [JsonPropertyName("balance")]
    public required string Balance { get; set; }

    /// <summary>
    /// Lifetime consumed credits
    /// </summary>
    [JsonPropertyName("consumedCredits")]
    public required string ConsumedCredits { get; set; }

    /// <summary>
    /// Lifetime consumed amount
    /// </summary>
    [JsonPropertyName("consumedAmount")]
    public required string ConsumedAmount { get; set; }

    [JsonPropertyName("status")]
    public required WalletResponseStatus Status { get; set; }

    [JsonPropertyName("expirationAt")]
    public string? ExpirationAt { get; set; }

    [JsonPropertyName("terminatedAt")]
    public string? TerminatedAt { get; set; }

    [JsonPropertyName("customer")]
    public WalletCustomerResponse? Customer { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

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
