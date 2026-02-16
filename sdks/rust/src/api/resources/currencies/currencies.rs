use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct CurrenciesClient {
    pub http_client: HttpClient,
}

impl CurrenciesClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve all supported currencies with their symbols and metadata.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, options: Option<RequestOptions>) -> Result<Vec<CurrencyResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/currencies",
            None,
            None,
            options,
        ).await
    }

}

