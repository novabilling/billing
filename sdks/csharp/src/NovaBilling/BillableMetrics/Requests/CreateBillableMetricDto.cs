using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateBillableMetricDto
{
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    /// <summary>
    /// Unique metric code
    /// </summary>
    [JsonPropertyName("code")]
    public required string Code { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("aggregationType")]
    public required CreateBillableMetricDtoAggregationType AggregationType { get; set; }

    /// <summary>
    /// Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
    /// </summary>
    [JsonPropertyName("fieldName")]
    public string? FieldName { get; set; }

    /// <summary>
    /// If true, value carries forward across billing periods
    /// </summary>
    [JsonPropertyName("recurring")]
    public bool? Recurring { get; set; }

    [JsonPropertyName("filters")]
    public IEnumerable<CreateBillableMetricFilterDto>? Filters { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
