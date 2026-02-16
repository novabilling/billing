using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record ListCreditNotesRequest
{
    [JsonIgnore]
    public string? CustomerId { get; set; }

    [JsonIgnore]
    public string? InvoiceId { get; set; }

    [JsonIgnore]
    public ListCreditNotesRequestStatus? Status { get; set; }

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
