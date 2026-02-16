using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetCustomersAnalyticsRequest
{
    [JsonIgnore]
    public string? DateFrom { get; set; }

    [JsonIgnore]
    public string? DateTo { get; set; }

    [JsonIgnore]
    public string? Currency { get; set; }

    [JsonIgnore]
    public GetCustomersAnalyticsRequestGroupBy? GroupBy { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
