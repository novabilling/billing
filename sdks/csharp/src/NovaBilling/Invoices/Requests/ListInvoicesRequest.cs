using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ListInvoicesRequest
{
    [JsonIgnore]
    public string? Status { get; set; }

    [JsonIgnore]
    public string? CustomerId { get; set; }

    [JsonIgnore]
    public string? DateFrom { get; set; }

    [JsonIgnore]
    public string? DateTo { get; set; }

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
