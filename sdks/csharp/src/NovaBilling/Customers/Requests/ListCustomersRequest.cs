using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ListCustomersRequest
{
    [JsonIgnore]
    public double? Page { get; set; }

    [JsonIgnore]
    public double? Limit { get; set; }

    /// <summary>
    /// Search by name or email
    /// </summary>
    [JsonIgnore]
    public string? Search { get; set; }

    [JsonIgnore]
    public string? Country { get; set; }

    [JsonIgnore]
    public string? Currency { get; set; }

    [JsonIgnore]
    public string? SortBy { get; set; }

    [JsonIgnore]
    public ListCustomersRequestSortOrder? SortOrder { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
