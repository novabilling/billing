use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct PaymentsClient {
    pub http_client: HttpClient,
}

impl PaymentsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of payments. Supports filtering by status, provider, invoice, and date range.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &PaymentsListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedPaymentResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/payments",
            None,
            QueryBuilder::new().string("status", request.status.clone()).string("provider", request.provider.clone()).string("invoiceId", request.invoice_id.clone()).string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a payment record manually. Useful for importing historical data. If status is SUCCEEDED, the associated invoice will also be marked as paid.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn payments_controller_create(&self, request: &CreatePaymentDto, options: Option<RequestOptions>) -> Result<PaymentResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/payments",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve detailed payment information including the associated invoice and customer.
    ///
    /// # Arguments
    ///
    /// * `id` - Payment ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<PaymentResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/payments/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Issue a full or partial refund for a succeeded payment. If amount is omitted, the full payment amount is refunded.
    ///
    /// # Arguments
    ///
    /// * `id` - Payment ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn refund(&self, id: &String, request: &RefundPaymentDto, options: Option<RequestOptions>) -> Result<PaymentResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/payments/{}/refund", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

}

