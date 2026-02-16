using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetBySubscriptionEventsRequest
{
    /// <summary>
    /// Subscription ID
    /// </summary>
    [JsonIgnore]
    public required string SubscriptionId { get; set; }

    /// <summary>
    /// Filter by metric code
    /// </summary>
    [JsonIgnore]
    public string? Code { get; set; }

    /// <summary>
    /// Start date (ISO 8601)
    /// </summary>
    [JsonIgnore]
    public string? From { get; set; }

    /// <summary>
    /// End date (ISO 8601)
    /// </summary>
    [JsonIgnore]
    public string? To { get; set; }

    [JsonIgnore]
    public double? Page { get; set; }

    [JsonIgnore]
    public double? PerPage { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
