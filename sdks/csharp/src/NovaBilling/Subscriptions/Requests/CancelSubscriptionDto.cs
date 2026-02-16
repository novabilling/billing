using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CancelSubscriptionDto
{
    /// <summary>
    /// Subscription ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// When to cancel: immediately or at end of current period
    /// </summary>
    [JsonPropertyName("cancelAt")]
    public required CancelSubscriptionDtoCancelAt CancelAt { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
