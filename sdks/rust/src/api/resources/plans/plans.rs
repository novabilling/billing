use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct PlansClient {
    pub http_client: HttpClient,
}

impl PlansClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve all billing plans with their prices. Optionally filter by active status.
    ///
    /// # Arguments
    ///
    /// * `is_active` - Filter by active status
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &PlansListQueryRequest, options: Option<RequestOptions>) -> Result<Vec<PlanResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/plans",
            None,
            QueryBuilder::new().bool("isActive", request.is_active.clone())
            .build(),
            options,
        ).await
    }

    /// Create a billing plan with a unique code. Optionally include prices for different currencies. Plans can have MONTHLY, QUARTERLY, or YEARLY billing intervals.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreatePlanDto, options: Option<RequestOptions>) -> Result<PlanResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/plans",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve a plan with all its prices and features.
    ///
    /// # Arguments
    ///
    /// * `id` - Plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<PlanResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/plans/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Delete a billing plan. Plans with active subscriptions should be deactivated instead.
    ///
    /// # Arguments
    ///
    /// * `id` - Plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<PlanResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/plans/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update plan details like name, description, features, or billing interval.
    ///
    /// # Arguments
    ///
    /// * `id` - Plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdatePlanDto, options: Option<RequestOptions>) -> Result<PlanResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/plans/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Add a price in a specific currency to a plan. Each plan can have one price per currency.
    ///
    /// # Arguments
    ///
    /// * `id` - Plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn add_price(&self, id: &String, request: &CreatePlanPriceDto, options: Option<RequestOptions>) -> Result<PlanPriceResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/plans/{}/prices", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Remove a price from a plan. Active subscriptions using this price will not be affected.
    ///
    /// # Arguments
    ///
    /// * `id` - Plan ID
    /// * `price_id` - Price ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete_price(&self, id: &String, price_id: &String, options: Option<RequestOptions>) -> Result<PlanPriceResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/plans/{}/prices/{}", id, price_id),
            None,
            None,
            options,
        ).await
    }

    /// Change the amount for an existing price on a plan.
    ///
    /// # Arguments
    ///
    /// * `id` - Plan ID
    /// * `price_id` - Price ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update_price(&self, id: &String, price_id: &String, options: Option<RequestOptions>) -> Result<PlanPriceResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/plans/{}/prices/{}", id, price_id),
            None,
            None,
            options,
        ).await
    }

}

