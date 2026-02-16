using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[Serializable]
public record CreateSubscriptionDto
{
    /// <summary>
    /// Customer ID
    /// </summary>
    [JsonPropertyName("customerId")]
    public required string CustomerId { get; set; }

    /// <summary>
    /// Plan ID
    /// </summary>
    [JsonPropertyName("planId")]
    public required string PlanId { get; set; }

    /// <summary>
    /// Currency for billing
    /// </summary>
    [JsonPropertyName("currency")]
    public required string Currency { get; set; }

    /// <summary>
    /// Number of trial days
    /// </summary>
    [JsonPropertyName("trialDays")]
    public double? TrialDays { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    /// <summary>
    /// Override subscription start date (ISO 8601). Defaults to now.
    /// </summary>
    [JsonPropertyName("startDate")]
    public string? StartDate { get; set; }

    /// <summary>
    /// Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
    /// </summary>
    [JsonPropertyName("currentPeriodEnd")]
    public string? CurrentPeriodEnd { get; set; }

    /// <summary>
    /// Override subscription status for imports
    /// </summary>
    [JsonPropertyName("status")]
    public CreateSubscriptionDtoStatus? Status { get; set; }

    /// <summary>
    /// Backdate createdAt (ISO 8601). For data imports.
    /// </summary>
    [JsonPropertyName("createdAt")]
    public string? CreatedAt { get; set; }

    /// <summary>
    /// External ID for linking to external systems
    /// </summary>
    [JsonPropertyName("externalId")]
    public string? ExternalId { get; set; }

    /// <summary>
    /// Canceled at date (ISO 8601). For importing canceled subscriptions.
    /// </summary>
    [JsonPropertyName("canceledAt")]
    public string? CanceledAt { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
