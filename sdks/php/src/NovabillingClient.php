<?php

namespace NovaBilling;

use NovaBilling\Auth\AuthClient;
use NovaBilling\Tenants\TenantsClient;
use NovaBilling\ApiKeys\ApiKeysClient;
use NovaBilling\Currencies\CurrenciesClient;
use NovaBilling\Customers\CustomersClient;
use NovaBilling\Plans\PlansClient;
use NovaBilling\Subscriptions\SubscriptionsClient;
use NovaBilling\Invoices\InvoicesClient;
use NovaBilling\Payments\PaymentsClient;
use NovaBilling\PaymentProviders\PaymentProvidersClient;
use NovaBilling\Webhooks\WebhooksClient;
use NovaBilling\Analytics\AnalyticsClient;
use NovaBilling\Coupons\CouponsClient;
use NovaBilling\AddOns\AddOnsClient;
use NovaBilling\CreditNotes\CreditNotesClient;
use NovaBilling\Portal\PortalClient;
use NovaBilling\BillableMetrics\BillableMetricsClient;
use NovaBilling\Events\EventsClient;
use NovaBilling\Charges\ChargesClient;
use NovaBilling\Wallets\WalletsClient;
use NovaBilling\PaymentMethods\PaymentMethodsClient;
use NovaBilling\Taxes\TaxesClient;
use NovaBilling\PlanOverrides\PlanOverridesClient;
use Psr\Http\Client\ClientInterface;
use NovaBilling\Core\Client\RawClient;

class NovabillingClient
{
    /**
     * @var AuthClient $auth
     */
    public AuthClient $auth;

    /**
     * @var TenantsClient $tenants
     */
    public TenantsClient $tenants;

    /**
     * @var ApiKeysClient $apiKeys
     */
    public ApiKeysClient $apiKeys;

    /**
     * @var CurrenciesClient $currencies
     */
    public CurrenciesClient $currencies;

    /**
     * @var CustomersClient $customers
     */
    public CustomersClient $customers;

    /**
     * @var PlansClient $plans
     */
    public PlansClient $plans;

    /**
     * @var SubscriptionsClient $subscriptions
     */
    public SubscriptionsClient $subscriptions;

    /**
     * @var InvoicesClient $invoices
     */
    public InvoicesClient $invoices;

    /**
     * @var PaymentsClient $payments
     */
    public PaymentsClient $payments;

    /**
     * @var PaymentProvidersClient $paymentProviders
     */
    public PaymentProvidersClient $paymentProviders;

    /**
     * @var WebhooksClient $webhooks
     */
    public WebhooksClient $webhooks;

    /**
     * @var AnalyticsClient $analytics
     */
    public AnalyticsClient $analytics;

    /**
     * @var CouponsClient $coupons
     */
    public CouponsClient $coupons;

    /**
     * @var AddOnsClient $addOns
     */
    public AddOnsClient $addOns;

    /**
     * @var CreditNotesClient $creditNotes
     */
    public CreditNotesClient $creditNotes;

    /**
     * @var PortalClient $portal
     */
    public PortalClient $portal;

    /**
     * @var BillableMetricsClient $billableMetrics
     */
    public BillableMetricsClient $billableMetrics;

    /**
     * @var EventsClient $events
     */
    public EventsClient $events;

    /**
     * @var ChargesClient $charges
     */
    public ChargesClient $charges;

    /**
     * @var WalletsClient $wallets
     */
    public WalletsClient $wallets;

    /**
     * @var PaymentMethodsClient $paymentMethods
     */
    public PaymentMethodsClient $paymentMethods;

    /**
     * @var TaxesClient $taxes
     */
    public TaxesClient $taxes;

    /**
     * @var PlanOverridesClient $planOverrides
     */
    public PlanOverridesClient $planOverrides;

    /**
     * @var array{
     *   baseUrl?: string,
     *   client?: ClientInterface,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     * } $options @phpstan-ignore-next-line Property is used in endpoint methods via HttpEndpointGenerator
     */
    private array $options;

    /**
     * @var RawClient $client
     */
    private RawClient $client;

    /**
     * @param string $authorization
     * @param ?string $token The token to use for authentication.
     * @param ?array{
     *   baseUrl?: string,
     *   client?: ClientInterface,
     *   maxRetries?: int,
     *   timeout?: float,
     *   headers?: array<string, string>,
     * } $options
     */
    public function __construct(
        string $authorization,
        ?string $token = null,
        ?array $options = null,
    ) {
        $defaultHeaders = [
            'Authorization' => $authorization,
            'X-Fern-Language' => 'PHP',
            'X-Fern-SDK-Name' => 'NovaBilling',
        ];
        if ($token != null) {
            $defaultHeaders['Authorization'] = "Bearer $token";
        }

        $this->options = $options ?? [];

        $this->options['headers'] = array_merge(
            $defaultHeaders,
            $this->options['headers'] ?? [],
        );

        $this->client = new RawClient(
            options: $this->options,
        );

        $this->auth = new AuthClient($this->client, $this->options);
        $this->tenants = new TenantsClient($this->client, $this->options);
        $this->apiKeys = new ApiKeysClient($this->client, $this->options);
        $this->currencies = new CurrenciesClient($this->client, $this->options);
        $this->customers = new CustomersClient($this->client, $this->options);
        $this->plans = new PlansClient($this->client, $this->options);
        $this->subscriptions = new SubscriptionsClient($this->client, $this->options);
        $this->invoices = new InvoicesClient($this->client, $this->options);
        $this->payments = new PaymentsClient($this->client, $this->options);
        $this->paymentProviders = new PaymentProvidersClient($this->client, $this->options);
        $this->webhooks = new WebhooksClient($this->client, $this->options);
        $this->analytics = new AnalyticsClient($this->client, $this->options);
        $this->coupons = new CouponsClient($this->client, $this->options);
        $this->addOns = new AddOnsClient($this->client, $this->options);
        $this->creditNotes = new CreditNotesClient($this->client, $this->options);
        $this->portal = new PortalClient($this->client, $this->options);
        $this->billableMetrics = new BillableMetricsClient($this->client, $this->options);
        $this->events = new EventsClient($this->client, $this->options);
        $this->charges = new ChargesClient($this->client, $this->options);
        $this->wallets = new WalletsClient($this->client, $this->options);
        $this->paymentMethods = new PaymentMethodsClient($this->client, $this->options);
        $this->taxes = new TaxesClient($this->client, $this->options);
        $this->planOverrides = new PlanOverridesClient($this->client, $this->options);
    }
}
