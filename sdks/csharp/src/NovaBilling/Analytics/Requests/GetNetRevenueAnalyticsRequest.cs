using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetNetRevenueAnalyticsRequest
{
    [JsonIgnore]
    public string? DateFrom { get; set; }

    [JsonIgnore]
    public string? DateTo { get; set; }

    [JsonIgnore]
    public string? Currency { get; set; }

    [JsonIgnore]
    public GetNetRevenueAnalyticsRequestGroupBy? GroupBy { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
