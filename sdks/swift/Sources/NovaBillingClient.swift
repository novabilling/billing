import Foundation

/// Use this class to access the different functions within the SDK. You can instantiate any number of clients with different configuration that will propagate to these functions.
public final class NovaBillingClient: Sendable {
    public let auth: AuthClient
    public let tenants: TenantsClient
    public let apiKeys: ApiKeysClient
    public let currencies: CurrenciesClient
    public let customers: CustomersClient
    public let plans: PlansClient
    public let subscriptions: SubscriptionsClient
    public let invoices: InvoicesClient
    public let payments: PaymentsClient
    public let paymentProviders: PaymentProvidersClient
    public let webhooks: WebhooksClient
    public let analytics: AnalyticsClient
    public let coupons: CouponsClient
    public let addOns: AddOnsClient
    public let creditNotes: CreditNotesClient
    public let portal: PortalClient
    public let billableMetrics: BillableMetricsClient
    public let events: EventsClient
    public let charges: ChargesClient
    public let wallets: WalletsClient
    public let paymentMethods: PaymentMethodsClient
    public let taxes: TaxesClient
    public let planOverrides: PlanOverridesClient
    private let httpClient: HTTPClient

    /// Initialize the client with the specified configuration and a static bearer token.
    ///
    /// - Parameter baseURL: The base URL to use for requests from the client. If not provided, the default base URL will be used.
    /// - Parameter token: Bearer token for authentication. If provided, will be sent as "Bearer {token}" in Authorization header.
    /// - Parameter headers: Additional headers to send with each request.
    /// - Parameter timeout: Request timeout in seconds. Defaults to 60 seconds. Ignored if a custom `urlSession` is provided.
    /// - Parameter maxRetries: Maximum number of retries for failed requests. Defaults to 2.
    /// - Parameter urlSession: Custom `URLSession` to use for requests. If not provided, a default session will be created with the specified timeout.
    public convenience init(
        baseURL: String = NovaBillingEnvironment.default.rawValue,
        token: String? = nil,
        headers: [String: String]? = nil,
        timeout: Int? = nil,
        maxRetries: Int? = nil,
        urlSession: Networking.URLSession? = nil
    ) {
        self.init(
            baseURL: baseURL,
            headerAuth: nil,
            bearerAuth: token.map {
                .init(token: .staticToken($0))
            },
            basicAuth: nil,
            headers: headers,
            timeout: timeout,
            maxRetries: maxRetries,
            urlSession: urlSession
        )
    }

    /// Initialize the client with the specified configuration and an async bearer token provider.
    ///
    /// - Parameter baseURL: The base URL to use for requests from the client. If not provided, the default base URL will be used.
    /// - Parameter token: An async function that returns the bearer token for authentication. If provided, will be sent as "Bearer {token}" in Authorization header.
    /// - Parameter headers: Additional headers to send with each request.
    /// - Parameter timeout: Request timeout in seconds. Defaults to 60 seconds. Ignored if a custom `urlSession` is provided.
    /// - Parameter maxRetries: Maximum number of retries for failed requests. Defaults to 2.
    /// - Parameter urlSession: Custom `URLSession` to use for requests. If not provided, a default session will be created with the specified timeout.
    public convenience init(
        baseURL: String = NovaBillingEnvironment.default.rawValue,
        token: ClientConfig.CredentialProvider? = nil,
        headers: [String: String]? = nil,
        timeout: Int? = nil,
        maxRetries: Int? = nil,
        urlSession: Networking.URLSession? = nil
    ) {
        self.init(
            baseURL: baseURL,
            headerAuth: nil,
            bearerAuth: token.map {
                .init(token: .provider($0))
            },
            basicAuth: nil,
            headers: headers,
            timeout: timeout,
            maxRetries: maxRetries,
            urlSession: urlSession
        )
    }

    init(
        baseURL: String,
        headerAuth: ClientConfig.HeaderAuth? = nil,
        bearerAuth: ClientConfig.BearerAuth? = nil,
        basicAuth: ClientConfig.BasicAuth? = nil,
        headers: [String: String]? = nil,
        timeout: Int? = nil,
        maxRetries: Int? = nil,
        urlSession: Networking.URLSession? = nil
    ) {
        let config = ClientConfig(
            baseURL: baseURL,
            headerAuth: headerAuth,
            bearerAuth: bearerAuth,
            basicAuth: basicAuth,
            headers: headers,
            timeout: timeout,
            maxRetries: maxRetries,
            urlSession: urlSession
        )
        self.auth = AuthClient(config: config)
        self.tenants = TenantsClient(config: config)
        self.apiKeys = ApiKeysClient(config: config)
        self.currencies = CurrenciesClient(config: config)
        self.customers = CustomersClient(config: config)
        self.plans = PlansClient(config: config)
        self.subscriptions = SubscriptionsClient(config: config)
        self.invoices = InvoicesClient(config: config)
        self.payments = PaymentsClient(config: config)
        self.paymentProviders = PaymentProvidersClient(config: config)
        self.webhooks = WebhooksClient(config: config)
        self.analytics = AnalyticsClient(config: config)
        self.coupons = CouponsClient(config: config)
        self.addOns = AddOnsClient(config: config)
        self.creditNotes = CreditNotesClient(config: config)
        self.portal = PortalClient(config: config)
        self.billableMetrics = BillableMetricsClient(config: config)
        self.events = EventsClient(config: config)
        self.charges = ChargesClient(config: config)
        self.wallets = WalletsClient(config: config)
        self.paymentMethods = PaymentMethodsClient(config: config)
        self.taxes = TaxesClient(config: config)
        self.planOverrides = PlanOverridesClient(config: config)
        self.httpClient = HTTPClient(config: config)
    }
}