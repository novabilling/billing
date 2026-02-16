using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record UpdateCreditNoteDto
{
    /// <summary>
    /// Credit note ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Updated amount
    /// </summary>
    [JsonPropertyName("amount")]
    public double? Amount { get; set; }

    [JsonPropertyName("reason")]
    public UpdateCreditNoteDtoReason? Reason { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
