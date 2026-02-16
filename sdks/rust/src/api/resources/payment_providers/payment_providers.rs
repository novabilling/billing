use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct PaymentProvidersClient {
    pub http_client: HttpClient,
}

impl PaymentProvidersClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve all configured payment providers for the tenant. Credentials are never returned.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, options: Option<RequestOptions>) -> Result<Vec<PaymentProviderResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/payment-providers",
            None,
            None,
            options,
        ).await
    }

    /// Set up a payment provider (stripe, paystack, flutterwave, or mpesa) with encrypted credentials. The provider with the lowest priority number is used by default for checkout.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn configure(&self, request: &CreateProviderDto, options: Option<RequestOptions>) -> Result<PaymentProviderResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/payment-providers",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve a specific payment provider configuration. Credentials are not included.
    ///
    /// # Arguments
    ///
    /// * `id` - Payment provider ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<PaymentProviderResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/payment-providers/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Remove a payment provider configuration. This does not affect existing payments.
    ///
    /// # Arguments
    ///
    /// * `id` - Payment provider ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<PaymentProviderResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/payment-providers/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update provider settings such as active status, priority, or credentials.
    ///
    /// # Arguments
    ///
    /// * `id` - Payment provider ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdateProviderDto, options: Option<RequestOptions>) -> Result<PaymentProviderResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/payment-providers/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Verify that the provider credentials are valid by making a test API call to the provider.
    ///
    /// # Arguments
    ///
    /// * `id` - Payment provider ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn test_connection(&self, id: &String, options: Option<RequestOptions>) -> Result<ProviderTestResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/payment-providers/{}/test", id),
            None,
            None,
            options,
        ).await
    }

}

