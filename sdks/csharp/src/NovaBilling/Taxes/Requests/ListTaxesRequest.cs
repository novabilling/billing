using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ListTaxesRequest
{
    [JsonIgnore]
    public bool? AppliedByDefault { get; set; }

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
