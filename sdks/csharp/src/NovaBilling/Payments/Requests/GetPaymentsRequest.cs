using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record GetPaymentsRequest
{
    /// <summary>
    /// Payment ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
