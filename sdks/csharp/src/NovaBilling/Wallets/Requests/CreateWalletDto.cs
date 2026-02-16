using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateWalletDto
{
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
    public double? RateAmount { get; set; }

    /// <summary>
    /// Paid credits (purchase)
    /// </summary>
    [JsonPropertyName("paidCredits")]
    public double? PaidCredits { get; set; }

    /// <summary>
    /// Free credits (grant)
    /// </summary>
    [JsonPropertyName("grantedCredits")]
    public double? GrantedCredits { get; set; }

    /// <summary>
    /// Expiration date (ISO 8601)
    /// </summary>
    [JsonPropertyName("expirationAt")]
    public string? ExpirationAt { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <summary>
    /// Backdate createdAt (ISO 8601). For data imports.
    /// </summary>
    [JsonPropertyName("createdAt")]
    public string? CreatedAt { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
