using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record BatchEventsDto
{
    /// <summary>
    /// Array of events to ingest (max 100)
    /// </summary>
    [JsonPropertyName("events")]
    public IEnumerable<CreateEventDto> Events { get; set; } = new List<CreateEventDto>();

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
