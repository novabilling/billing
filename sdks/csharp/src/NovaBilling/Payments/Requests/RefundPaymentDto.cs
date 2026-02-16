using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RefundPaymentDto
{
    /// <summary>
    /// Payment ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Amount to refund (full refund if omitted)
    /// </summary>
    [JsonPropertyName("amount")]
    public double? Amount { get; set; }

    /// <summary>
    /// Reason for refund
    /// </summary>
    [JsonPropertyName("reason")]
    public string? Reason { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
