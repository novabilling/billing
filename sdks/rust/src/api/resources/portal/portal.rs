use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct PortalClient {
    pub http_client: HttpClient,
}

impl PortalClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Returns subscriptions, recent invoices, payments, and summary stats for a customer. Use this to render a billing dashboard for your end-users.
    ///
    /// # Arguments
    ///
    /// * `external_id` - Customer external ID (your app user ID)
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// Empty response
    pub async fn get_billing(&self, external_id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/portal/customers/{}/billing", external_id),
            None,
            None,
            options,
        ).await
    }

    /// Returns all subscriptions for the customer with plan details.
    ///
    /// # Arguments
    ///
    /// * `external_id` - Customer external ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_subscriptions(&self, external_id: &String, options: Option<RequestOptions>) -> Result<Vec<SubscriptionResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/portal/customers/{}/subscriptions", external_id),
            None,
            None,
            options,
        ).await
    }

    /// Returns a paginated list of invoices. Filter by status to show only pending invoices.
    ///
    /// # Arguments
    ///
    /// * `external_id` - Customer external ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_invoices(&self, external_id: &String, request: &GetInvoicesQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedInvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/portal/customers/{}/invoices", external_id),
            None,
            QueryBuilder::new().serialize("status", request.status.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Initiates a payment session with the configured payment provider. Returns a checkout URL to redirect the customer to.
    ///
    /// # Arguments
    ///
    /// * `external_id` - Customer external ID
    /// * `invoice_id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create_checkout(&self, external_id: &String, invoice_id: &String, options: Option<RequestOptions>) -> Result<CheckoutResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/portal/customers/{}/invoices/{}/checkout", external_id, invoice_id),
            None,
            None,
            options,
        ).await
    }

    /// Returns a paginated list of all payments made by the customer.
    ///
    /// # Arguments
    ///
    /// * `external_id` - Customer external ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_payments(&self, external_id: &String, request: &PortalGetPaymentsQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedPaymentResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/portal/customers/{}/payments", external_id),
            None,
            QueryBuilder::new().float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

}

