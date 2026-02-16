using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetPaymentsAnalyticsRequest
{
    [JsonIgnore]
    public string? DateFrom { get; set; }

    [JsonIgnore]
    public string? DateTo { get; set; }

    [JsonIgnore]
    public string? Currency { get; set; }

    [JsonIgnore]
    public GetPaymentsAnalyticsRequestGroupBy? GroupBy { get; set; }

    /// <summary>
    /// Filter by payment provider name
    /// </summary>
    [JsonIgnore]
    public string? Provider { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
