using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ApplyCouponDto
{
    [JsonPropertyName("couponId")]
    public required string CouponId { get; set; }

    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    [JsonPropertyName("subscriptionId")]
    public string? SubscriptionId { get; set; }

    /// <summary>
    /// Number of billing cycles to apply (null = forever)
    /// </summary>
    [JsonPropertyName("usesRemaining")]
    public double? UsesRemaining { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
