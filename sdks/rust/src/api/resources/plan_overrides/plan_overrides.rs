use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct PlanOverridesClient {
    pub http_client: HttpClient,
}

impl PlanOverridesClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// List all plan overrides, optionally filtered by customerId or planId
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &PlanOverridesListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedPlanOverrideResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/plan-overrides",
            None,
            QueryBuilder::new().string("customerId", request.customer_id.clone()).string("planId", request.plan_id.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a customer-specific override for a plan (custom pricing, minimum commitment, or charge properties)
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreatePlanOverrideDto, options: Option<RequestOptions>) -> Result<PlanOverrideResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/plan-overrides",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<PlanOverrideResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/plan-overrides/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/plan-overrides/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn update(&self, id: &String, request: &UpdatePlanOverrideDto, options: Option<RequestOptions>) -> Result<PlanOverrideResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/plan-overrides/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

}

