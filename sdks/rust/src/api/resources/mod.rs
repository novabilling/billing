//! Service clients and API endpoints
//!
//! This module contains client implementations for:
//!
//! - **Auth**
//! - **Tenants**
//! - **APIKeys**
//! - **Currencies**
//! - **Customers**
//! - **Plans**
//! - **Subscriptions**
//! - **Invoices**
//! - **Payments**
//! - **Payment Providers**
//! - **Webhooks**
//! - **Analytics**
//! - **Coupons**
//! - **AddOns**
//! - **CreditNotes**
//! - **Portal**
//! - **BillableMetrics**
//! - **Events**
//! - **Charges**
//! - **Wallets**
//! - **PaymentMethods**
//! - **Taxes**
//! - **PlanOverrides**

use crate::{ClientConfig, ApiError};

pub mod auth;
pub mod tenants;
pub mod api_keys;
pub mod currencies;
pub mod customers;
pub mod plans;
pub mod subscriptions;
pub mod invoices;
pub mod payments;
pub mod payment_providers;
pub mod webhooks;
pub mod analytics;
pub mod coupons;
pub mod add_ons;
pub mod credit_notes;
pub mod portal;
pub mod billable_metrics;
pub mod events;
pub mod charges;
pub mod wallets;
pub mod payment_methods;
pub mod taxes;
pub mod plan_overrides;
pub struct NovaBillingClient {
    pub config: ClientConfig,
    pub auth: AuthClient,
    pub tenants: TenantsClient,
    pub api_keys: APIKeysClient,
    pub currencies: CurrenciesClient,
    pub customers: CustomersClient,
    pub plans: PlansClient,
    pub subscriptions: SubscriptionsClient,
    pub invoices: InvoicesClient,
    pub payments: PaymentsClient,
    pub payment_providers: PaymentProvidersClient,
    pub webhooks: WebhooksClient,
    pub analytics: AnalyticsClient,
    pub coupons: CouponsClient,
    pub add_ons: AddOnsClient,
    pub credit_notes: CreditNotesClient,
    pub portal: PortalClient,
    pub billable_metrics: BillableMetricsClient,
    pub events: EventsClient,
    pub charges: ChargesClient,
    pub wallets: WalletsClient,
    pub payment_methods: PaymentMethodsClient,
    pub taxes: TaxesClient,
    pub plan_overrides: PlanOverridesClient,
}

impl NovaBillingClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
            config: config.clone(),
            auth: AuthClient::new(config.clone())?,
            tenants: TenantsClient::new(config.clone())?,
            api_keys: APIKeysClient::new(config.clone())?,
            currencies: CurrenciesClient::new(config.clone())?,
            customers: CustomersClient::new(config.clone())?,
            plans: PlansClient::new(config.clone())?,
            subscriptions: SubscriptionsClient::new(config.clone())?,
            invoices: InvoicesClient::new(config.clone())?,
            payments: PaymentsClient::new(config.clone())?,
            payment_providers: PaymentProvidersClient::new(config.clone())?,
            webhooks: WebhooksClient::new(config.clone())?,
            analytics: AnalyticsClient::new(config.clone())?,
            coupons: CouponsClient::new(config.clone())?,
            add_ons: AddOnsClient::new(config.clone())?,
            credit_notes: CreditNotesClient::new(config.clone())?,
            portal: PortalClient::new(config.clone())?,
            billable_metrics: BillableMetricsClient::new(config.clone())?,
            events: EventsClient::new(config.clone())?,
            charges: ChargesClient::new(config.clone())?,
            wallets: WalletsClient::new(config.clone())?,
            payment_methods: PaymentMethodsClient::new(config.clone())?,
            taxes: TaxesClient::new(config.clone())?,
            plan_overrides: PlanOverridesClient::new(config.clone())?
        })
    }

}

pub use auth::AuthClient;
pub use tenants::TenantsClient;
pub use api_keys::APIKeysClient;
pub use currencies::CurrenciesClient;
pub use customers::CustomersClient;
pub use plans::PlansClient;
pub use subscriptions::SubscriptionsClient;
pub use invoices::InvoicesClient;
pub use payments::PaymentsClient;
pub use payment_providers::PaymentProvidersClient;
pub use webhooks::WebhooksClient;
pub use analytics::AnalyticsClient;
pub use coupons::CouponsClient;
pub use add_ons::AddOnsClient;
pub use credit_notes::CreditNotesClient;
pub use portal::PortalClient;
pub use billable_metrics::BillableMetricsClient;
pub use events::EventsClient;
pub use charges::ChargesClient;
pub use wallets::WalletsClient;
pub use payment_methods::PaymentMethodsClient;
pub use taxes::TaxesClient;
pub use plan_overrides::PlanOverridesClient;
