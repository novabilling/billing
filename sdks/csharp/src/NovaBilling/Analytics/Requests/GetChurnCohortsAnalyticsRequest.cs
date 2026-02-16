using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetChurnCohortsAnalyticsRequest
{
    /// <summary>
    /// Number of months to analyze (default 12)
    /// </summary>
    [JsonIgnore]
    public double? Months { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
