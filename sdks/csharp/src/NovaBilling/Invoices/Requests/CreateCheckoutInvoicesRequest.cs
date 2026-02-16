using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateCheckoutInvoicesRequest
{
    /// <summary>
    /// Invoice ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// URL to redirect customer after payment
    /// </summary>
    [JsonPropertyName("callbackUrl")]
    public string? CallbackUrl { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
