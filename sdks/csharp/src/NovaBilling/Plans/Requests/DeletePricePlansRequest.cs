using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record DeletePricePlansRequest
{
    /// <summary>
    /// Plan ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Price ID
    /// </summary>
    [JsonIgnore]
    public required string PriceId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
