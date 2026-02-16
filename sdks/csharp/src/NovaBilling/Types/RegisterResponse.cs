using System.Text.Json;
using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record RegisterResponse : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("accessToken")]
    public required string AccessToken { get; set; }

    [JsonPropertyName("refreshToken")]
    public required string RefreshToken { get; set; }

    [JsonPropertyName("tenant")]
    public required TenantInfoResponse Tenant { get; set; }

    [JsonPropertyName("apiKey")]
    public required string ApiKey { get; set; }

    [JsonIgnore]
    public ReadOnlyAdditionalProperties AdditionalProperties { get; private set; } = new();

    void IJsonOnDeserialized.OnDeserialized() =>
        AdditionalProperties.CopyFromExtensionData(_extensionData);

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
