using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ListChargesRequest
{
    /// <summary>
    /// Filter by plan ID
    /// </summary>
    [JsonIgnore]
    public string? PlanId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
