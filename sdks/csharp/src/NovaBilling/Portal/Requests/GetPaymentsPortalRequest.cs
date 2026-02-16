using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetPaymentsPortalRequest
{
    /// <summary>
    /// Customer external ID
    /// </summary>
    [JsonIgnore]
    public required string ExternalId { get; set; }

    [JsonIgnore]
    public double? Page { get; set; }

    [JsonIgnore]
    public double? Limit { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
