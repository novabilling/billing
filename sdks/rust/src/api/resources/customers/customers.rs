use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct CustomersClient {
    pub http_client: HttpClient,
}

impl CustomersClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of customers. Supports filtering by search term, country, and currency.
    ///
    /// # Arguments
    ///
    /// * `search` - Search by name or email
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &CustomersListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedCustomerResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/customers",
            None,
            QueryBuilder::new().float("page", request.page.clone()).float("limit", request.limit.clone()).string("search", request.search.clone()).string("country", request.country.clone()).string("currency", request.currency.clone()).string("sortBy", request.sort_by.clone()).serialize("sortOrder", request.sort_order.clone())
            .build(),
            options,
        ).await
    }

    /// Create a customer record. The externalId should be unique and map to your application's user ID.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateCustomerDto, options: Option<RequestOptions>) -> Result<CustomerResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/customers",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve detailed information about a specific customer including their billing history summary.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<CustomerResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/customers/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Permanently delete a customer. Fails if the customer has active subscriptions.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// Empty response
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/customers/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update customer fields. Only provided fields will be changed.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdateCustomerDto, options: Option<RequestOptions>) -> Result<CustomerResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/customers/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve all subscriptions for a specific customer.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_subscriptions(&self, id: &String, options: Option<RequestOptions>) -> Result<Vec<SubscriptionResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/customers/{}/subscriptions", id),
            None,
            None,
            options,
        ).await
    }

    /// Retrieve all invoices for a specific customer.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_invoices(&self, id: &String, options: Option<RequestOptions>) -> Result<Vec<InvoiceResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/customers/{}/invoices", id),
            None,
            None,
            options,
        ).await
    }

    /// Retrieve all payments made by a specific customer.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_payments(&self, id: &String, options: Option<RequestOptions>) -> Result<Vec<PaymentResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/customers/{}/payments", id),
            None,
            None,
            options,
        ).await
    }

    /// Retrieve saved payment methods (cards, tokens) for a customer.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// Empty response
    pub async fn get_payment_methods(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/customers/{}/payment-methods", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn add_payment_method(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/customers/{}/payment-methods", id),
            None,
            None,
            options,
        ).await
    }

    /// Remove a saved payment method from a customer.
    ///
    /// # Arguments
    ///
    /// * `id` - Customer ID
    /// * `method_id` - Payment method ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// Empty response
    pub async fn delete_payment_method(&self, id: &String, method_id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/customers/{}/payment-methods/{}", id, method_id),
            None,
            None,
            options,
        ).await
    }

}

