using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ApplyAddOnDto
{
    /// <summary>
    /// Add-on ID
    /// </summary>
    [JsonPropertyName("addOnId")]
    public required string AddOnId { get; set; }

    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Subscription to attach the charge to
    /// </summary>
    [JsonPropertyName("subscriptionId")]
    public string? SubscriptionId { get; set; }

    /// <summary>
    /// Charge amount
    /// </summary>
    [JsonPropertyName("amount")]
    public required double Amount { get; set; }

    /// <summary>
    /// Currency
    /// </summary>
    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
