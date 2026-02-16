using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record TestSmtpTenantsRequest
{
    /// <summary>
    /// Recipient email address
    /// </summary>
    [JsonPropertyName("to")]
    public required string To { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
