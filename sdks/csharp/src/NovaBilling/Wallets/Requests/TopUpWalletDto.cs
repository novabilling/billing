using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record TopUpWalletDto
{
    [JsonPropertyName("walletId")]
    public required string WalletId { get; set; }

    /// <summary>
    /// Paid credits to purchase
    /// </summary>
    [JsonPropertyName("paidCredits")]
    public double? PaidCredits { get; set; }

    /// <summary>
    /// Free credits to grant
    /// </summary>
    [JsonPropertyName("grantedCredits")]
    public double? GrantedCredits { get; set; }

    /// <summary>
    /// Credits to void
    /// </summary>
    [JsonPropertyName("voidedCredits")]
    public double? VoidedCredits { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
