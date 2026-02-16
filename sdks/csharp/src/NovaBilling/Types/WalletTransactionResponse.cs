using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record WalletTransactionResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("walletId")]
    public required string WalletId { get; set; }

    [JsonPropertyName("transactionType")]
    public required WalletTransactionResponseTransactionType TransactionType { get; set; }

    [JsonPropertyName("status")]
    public required WalletTransactionResponseStatus Status { get; set; }

    [JsonPropertyName("transactionStatus")]
    public required WalletTransactionResponseTransactionStatus TransactionStatus { get; set; }

    /// <summary>
    /// Credits added or deducted
    /// </summary>
    [JsonPropertyName("creditAmount")]
    public required string CreditAmount { get; set; }

    /// <summary>
    /// Monetary equivalent
    /// </summary>
    [JsonPropertyName("amount")]
    public required string Amount { get; set; }

    [JsonPropertyName("invoiceId")]
    public string? InvoiceId { get; set; }

    [JsonPropertyName("settledAt")]
    public string? SettledAt { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    [JsonPropertyName("createdAt")]
    public required string CreatedAt { get; set; }

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
