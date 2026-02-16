using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record DeletePaymentMethodCustomersRequest
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Payment method ID
    /// </summary>
    [JsonIgnore]
    public required string MethodId { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
