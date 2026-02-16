using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record WebhooksControllerPaystackRequest
{
    /// <summary>
    /// Paystack HMAC-SHA512 signature
    /// </summary>
    [JsonIgnore]
    public required string PaystackSignature { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
