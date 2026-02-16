using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record SendEmailInvoicesRequest
{
    /// <summary>
    /// Invoice ID
    /// </summary>
    [JsonIgnore]
    public required string Id { get; set; }

    /// <summary>
    /// Recipient email address. Defaults to the customer email if omitted.
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
