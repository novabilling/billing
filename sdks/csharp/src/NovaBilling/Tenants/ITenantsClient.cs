namespace NovaBilling;

public partial interface ITenantsClient
{
    /// <summary>
    /// Retrieve the authenticated tenant's profile including settings and webhook configuration.
    /// </summary>
    WithRawResponseTask<TenantResponse> GetMeAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Update tenant profile fields such as company name, webhook URL, or custom settings.
    /// </summary>
    WithRawResponseTask<TenantResponse> UpdateMeAsync(
        UpdateTenantDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve usage metrics including customer count, active subscriptions, and total revenue.
    /// </summary>
    WithRawResponseTask<TenantUsageResponse> GetUsageAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Send a test email using the tenant's saved SMTP settings (or system defaults if not configured). Only requires recipient email address.
    /// </summary>
    WithRawResponseTask<MessageResponse> TestSmtpAsync(
        TestSmtpTenantsRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
