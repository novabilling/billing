using NovaBilling.Core;

namespace NovaBilling;

public partial class NovabillingApiClient : INovabillingApiClient
{
    private readonly RawClient _client;

    public NovabillingApiClient(
        string token,
        string authorization,
        ClientOptions? clientOptions = null
    )
    {
        clientOptions ??= new ClientOptions();
        var platformHeaders = new Headers(
            new Dictionary<string, string>()
            {
                { "X-Fern-Language", "C#" },
                { "X-Fern-SDK-Name", "NovaBilling" },
                { "X-Fern-SDK-Version", Version.Current },
            }
        );
        foreach (var header in platformHeaders)
        {
            if (!clientOptions.Headers.ContainsKey(header.Key))
            {
                clientOptions.Headers[header.Key] = header.Value;
            }
        }
        var clientOptionsWithAuth = clientOptions.Clone();
        var authHeaders = new Headers(
            new Dictionary<string, string>()
            {
                { "Authorization", $"Bearer {token}" },
                { "Authorization", authorization },
            }
        );
        foreach (var header in authHeaders)
        {
            clientOptionsWithAuth.Headers[header.Key] = header.Value;
        }
        _client = new RawClient(clientOptionsWithAuth);
        Auth = new AuthClient(_client);
        Tenants = new TenantsClient(_client);
        ApiKeys = new ApiKeysClient(_client);
        Currencies = new CurrenciesClient(_client);
        Customers = new CustomersClient(_client);
        Plans = new PlansClient(_client);
        Subscriptions = new SubscriptionsClient(_client);
        Invoices = new InvoicesClient(_client);
        Payments = new PaymentsClient(_client);
        PaymentProviders = new PaymentProvidersClient(_client);
        Webhooks = new WebhooksClient(_client);
        Analytics = new AnalyticsClient(_client);
        Coupons = new CouponsClient(_client);
        AddOns = new AddOnsClient(_client);
        CreditNotes = new CreditNotesClient(_client);
        Portal = new PortalClient(_client);
        BillableMetrics = new BillableMetricsClient(_client);
        Events = new EventsClient(_client);
        Charges = new ChargesClient(_client);
        Wallets = new WalletsClient(_client);
        PaymentMethods = new PaymentMethodsClient(_client);
        Taxes = new TaxesClient(_client);
        PlanOverrides = new PlanOverridesClient(_client);
    }

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
