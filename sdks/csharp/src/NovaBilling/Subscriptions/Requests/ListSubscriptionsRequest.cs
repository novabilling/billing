using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ListSubscriptionsRequest
{
    /// <summary>
    /// Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    /// </summary>
    [JsonIgnore]
    public string? Status { get; set; }

    /// <summary>
    /// Filter by customer ID
    /// </summary>
    [JsonIgnore]
    public string? CustomerId { get; set; }

    /// <summary>
    /// Filter by plan ID
    /// </summary>
    [JsonIgnore]
    public string? PlanId { get; set; }

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
