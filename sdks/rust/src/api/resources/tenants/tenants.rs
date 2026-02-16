use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct TenantsClient {
    pub http_client: HttpClient,
}

impl TenantsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve the authenticated tenant's profile including settings and webhook configuration.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_me(&self, options: Option<RequestOptions>) -> Result<TenantResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/tenants/me",
            None,
            None,
            options,
        ).await
    }

    /// Update tenant profile fields such as company name, webhook URL, or custom settings.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update_me(&self, request: &UpdateTenantDto, options: Option<RequestOptions>) -> Result<TenantResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            "api/tenants/me",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve usage metrics including customer count, active subscriptions, and total revenue.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_usage(&self, options: Option<RequestOptions>) -> Result<TenantUsageResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/tenants/me/usage",
            None,
            None,
            options,
        ).await
    }

    /// Send a test email using the tenant's saved SMTP settings (or system defaults if not configured). Only requires recipient email address.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn test_smtp(&self, request: &TestSMTPTenantsRequest, options: Option<RequestOptions>) -> Result<MessageResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/tenants/me/smtp/test",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

}

