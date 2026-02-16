using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record TestConnectionPaymentProvidersRequest
{
    /// <summary>
    /// Payment provider ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
