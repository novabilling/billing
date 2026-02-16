using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record WebhooksControllerFlutterwaveRequest
{
    /// <summary>
    /// Flutterwave verification hash
    /// </summary>
    [JsonIgnore]
    public string? VerifHash { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
