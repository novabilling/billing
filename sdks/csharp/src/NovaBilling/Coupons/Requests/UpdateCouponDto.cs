using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdateCouponDto
{
    /// <summary>
    /// Coupon ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("isActive")]
    public bool? IsActive { get; set; }

    [JsonPropertyName("expiresAt")]
    public string? ExpiresAt { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
