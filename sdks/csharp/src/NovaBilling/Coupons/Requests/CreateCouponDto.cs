using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateCouponDto
{
    /// <summary>
    /// Unique coupon code
    /// </summary>
    [JsonPropertyName("code")]
    public required string Code { get; set; }

    /// <summary>
    /// Display name
    /// </summary>
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("discountType")]
    public required CreateCouponDtoDiscountType DiscountType { get; set; }

    /// <summary>
    /// Discount value (percentage 0-100 or fixed amount)
    /// </summary>
    [JsonPropertyName("discountValue")]
    public required double DiscountValue { get; set; }

    /// <summary>
    /// Currency for FIXED_AMOUNT discounts
    /// </summary>
    [JsonPropertyName("currency")]
    public string? Currency { get; set; }

    /// <summary>
    /// Max number of redemptions (null = unlimited)
    /// </summary>
    [JsonPropertyName("maxRedemptions")]
    public double? MaxRedemptions { get; set; }

    /// <summary>
    /// Plan IDs this coupon applies to (empty = all)
    /// </summary>
    [JsonPropertyName("appliesToPlanIds")]
    public IEnumerable<string>? AppliesToPlanIds { get; set; }

    [JsonPropertyName("expiresAt")]
    public string? ExpiresAt { get; set; }

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
