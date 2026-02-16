use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct ChargesClient {
    pub http_client: HttpClient,
}

impl ChargesClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve all charges, optionally filtered by plan ID.
    ///
    /// # Arguments
    ///
    /// * `plan_id` - Filter by plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &ChargesListQueryRequest, options: Option<RequestOptions>) -> Result<Vec<ChargeResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/charges",
            None,
            QueryBuilder::new().string("planId", request.plan_id.clone())
            .build(),
            options,
        ).await
    }

    /// Create a usage-based charge linking a plan to a billable metric. Supported models: STANDARD, GRADUATED, VOLUME, PACKAGE, PERCENTAGE.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateChargeDto, options: Option<RequestOptions>) -> Result<ChargeResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/charges",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve a charge with its billable metric, graduated ranges, and filters.
    ///
    /// # Arguments
    ///
    /// * `id` - Charge ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<ChargeResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/charges/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Remove a charge from a plan.
    ///
    /// # Arguments
    ///
    /// * `id` - Charge ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<ChargeResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/charges/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update charge configuration including pricing, ranges, and filters.
    ///
    /// # Arguments
    ///
    /// * `id` - Charge ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdateChargeDto, options: Option<RequestOptions>) -> Result<ChargeResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/charges/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve all charges attached to a specific plan.
    ///
    /// # Arguments
    ///
    /// * `plan_id` - Plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_by_plan(&self, plan_id: &String, options: Option<RequestOptions>) -> Result<Vec<ChargeResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/charges/plan/{}", plan_id),
            None,
            None,
            options,
        ).await
    }

}

