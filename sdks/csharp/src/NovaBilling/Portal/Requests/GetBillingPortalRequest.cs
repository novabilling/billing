using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetBillingPortalRequest
{
    /// <summary>
    /// Customer external ID (your app user ID)
    /// </summary>
    [JsonIgnore]
    public required string ExternalId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
