using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record WebhooksControllerStripeRequest
{
    /// <summary>
    /// Stripe webhook signature
    /// </summary>
    [JsonIgnore]
    public required string StripeSignature { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
