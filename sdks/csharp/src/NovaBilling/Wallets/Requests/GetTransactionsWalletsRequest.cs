using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetTransactionsWalletsRequest
{
    /// <summary>
    /// Wallet ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    [JsonIgnore]
    public GetTransactionsWalletsRequestStatus? Status { get; set; }

    [JsonIgnore]
    public GetTransactionsWalletsRequestTransactionStatus? TransactionStatus { get; set; }

    [JsonIgnore]
    public GetTransactionsWalletsRequestTransactionType? TransactionType { get; set; }

    [JsonIgnore]
    public double? Page { get; set; }

    [JsonIgnore]
    public double? Limit { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
