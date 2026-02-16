namespace NovaBilling;

public partial interface INovabillingApiClient
{
    public IAuthClient Auth { get; }
    public ITenantsClient Tenants { get; }
    public IApiKeysClient ApiKeys { get; }
    public ICurrenciesClient Currencies { get; }
    public ICustomersClient Customers { get; }
    public IPlansClient Plans { get; }
    public ISubscriptionsClient Subscriptions { get; }
    public IInvoicesClient Invoices { get; }
    public IPaymentsClient Payments { get; }
    public IPaymentProvidersClient PaymentProviders { get; }
    public IWebhooksClient Webhooks { get; }
    public IAnalyticsClient Analytics { get; }
    public ICouponsClient Coupons { get; }
    public IAddOnsClient AddOns { get; }
    public ICreditNotesClient CreditNotes { get; }
    public IPortalClient Portal { get; }
    public IBillableMetricsClient BillableMetrics { get; }
    public IEventsClient Events { get; }
    public IChargesClient Charges { get; }
    public IWalletsClient Wallets { get; }
    public IPaymentMethodsClient PaymentMethods { get; }
    public ITaxesClient Taxes { get; }
    public IPlanOverridesClient PlanOverrides { get; }
}
