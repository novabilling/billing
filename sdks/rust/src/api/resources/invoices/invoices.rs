use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct InvoicesClient {
    pub http_client: HttpClient,
}

impl InvoicesClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of invoices. Supports filtering by status, customer, and date range.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &InvoicesListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedInvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/invoices",
            None,
            QueryBuilder::new().string("status", request.status.clone()).string("customerId", request.customer_id.clone()).string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a draft invoice with line items. The total amount is automatically calculated from the items.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateInvoiceDto, options: Option<RequestOptions>) -> Result<InvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/invoices",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve detailed invoice information including associated customer, subscription, and payments.
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<InvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/invoices/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Move an invoice from draft to pending status, making it ready for payment.
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn finalize(&self, id: &String, options: Option<RequestOptions>) -> Result<InvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/invoices/{}/finalize", id),
            None,
            None,
            options,
        ).await
    }

    /// Cancel an unpaid invoice. Paid invoices cannot be voided — use a refund instead.
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn void(&self, id: &String, options: Option<RequestOptions>) -> Result<InvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/invoices/{}/void", id),
            None,
            None,
            options,
        ).await
    }

    /// Record an offline or manual payment against an invoice. Accepts an optional paymentMethod (e.g. "cash", "bank_transfer", "check", "manual").
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn mark_paid(&self, id: &String, request: &MarkPaidInvoicesRequest, options: Option<RequestOptions>) -> Result<InvoiceResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/invoices/{}/mark-paid", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Initiate a payment session with the configured payment provider (Stripe, Paystack, Flutterwave, or M-Pesa). Returns a checkout URL that redirects the customer to the provider's hosted payment page.
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create_checkout(&self, id: &String, request: &CreateCheckoutInvoicesRequest, options: Option<RequestOptions>) -> Result<CheckoutResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/invoices/{}/checkout", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Send the invoice to a specified email address, or to the customer's email if none is provided.
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn send_email(&self, id: &String, request: &SendEmailInvoicesRequest, options: Option<RequestOptions>) -> Result<MessageResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/invoices/{}/send-email", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Returns the PDF binary for the invoice. If a PDF has not been generated yet, it will be created on-demand.
    ///
    /// # Arguments
    ///
    /// * `id` - Invoice ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// Empty response
    pub async fn get_pdf(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/invoices/{}/pdf", id),
            None,
            None,
            options,
        ).await
    }

}

