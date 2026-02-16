using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateCheckoutPortalRequest
{
    /// <summary>
    /// Customer external ID
    /// </summary>
    [JsonIgnore]
    public required string ExternalId { get; set; }

    /// <summary>
    /// Invoice ID
    /// </summary>
    [JsonIgnore]
    public required string InvoiceId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
