using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetSubscriptionsPortalRequest
{
    /// <summary>
    /// Customer external ID
    /// </summary>
    [JsonIgnore]
    public required string ExternalId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
