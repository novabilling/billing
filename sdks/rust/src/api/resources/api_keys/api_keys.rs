use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct APIKeysClient {
    pub http_client: HttpClient,
}

impl APIKeysClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve all API keys for the tenant. Keys are masked for security — only the last 8 characters are shown.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, options: Option<RequestOptions>) -> Result<Vec<APIKeyResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/tenants/me/api-keys",
            None,
            None,
            options,
        ).await
    }

    /// Generate a new API key with specified scopes. The full key is returned only once in the response — store it securely.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateAPIKeyBodyDto, options: Option<RequestOptions>) -> Result<APIKeyResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/tenants/me/api-keys",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Permanently revoke an API key. Any requests using this key will immediately fail.
    ///
    /// # Arguments
    ///
    /// * `id` - API key ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// Empty response
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/tenants/me/api-keys/{}", id),
            None,
            None,
            options,
        ).await
    }

}

