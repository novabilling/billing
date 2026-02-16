using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreatePaymentMethodDto
{
    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)
    /// </summary>
    [JsonPropertyName("provider")]
    public required string Provider { get; set; }

    [JsonPropertyName("type")]
    public CreatePaymentMethodDtoType? Type { get; set; }

    /// <summary>
    /// Provider-specific token/payment method ID
    /// </summary>
    [JsonPropertyName("tokenId")]
    public required string TokenId { get; set; }

    [JsonPropertyName("last4")]
    public string? Last4 { get; set; }

    [JsonPropertyName("brand")]
    public string? Brand { get; set; }

    [JsonPropertyName("expMonth")]
    public double? ExpMonth { get; set; }

    [JsonPropertyName("expYear")]
    public double? ExpYear { get; set; }

    [JsonPropertyName("cardholderName")]
    public string? CardholderName { get; set; }

    [JsonPropertyName("country")]
    public string? Country { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
