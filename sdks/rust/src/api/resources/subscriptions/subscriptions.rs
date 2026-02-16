use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct SubscriptionsClient {
    pub http_client: HttpClient,
}

impl SubscriptionsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of subscriptions. Supports filtering by status, customer, and plan.
    ///
    /// # Arguments
    ///
    /// * `status` - Filter by status (ACTIVE, TRIALING, PAUSED, CANCELED)
    /// * `customer_id` - Filter by customer ID
    /// * `plan_id` - Filter by plan ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &SubscriptionsListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedSubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/subscriptions",
            None,
            QueryBuilder::new().string("status", request.status.clone()).string("customerId", request.customer_id.clone()).string("planId", request.plan_id.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Subscribe a customer to a plan. The plan must have a price matching the specified currency. Optionally set a trial period in days.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateSubscriptionDto, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/subscriptions",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve detailed subscription information including customer, plan with prices, and recent invoices.
    ///
    /// # Arguments
    ///
    /// * `id` - Subscription ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/subscriptions/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update the metadata field on a subscription. Other fields cannot be changed directly.
    ///
    /// # Arguments
    ///
    /// * `id` - Subscription ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdateSubscriptionDto, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/subscriptions/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Cancel a subscription either immediately or at the end of the current billing period. When set to "period_end", the subscription remains active until the current period expires.
    ///
    /// # Arguments
    ///
    /// * `id` - Subscription ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn cancel(&self, id: &String, request: &CancelSubscriptionDto, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/subscriptions/{}/cancel", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Temporarily pause an active subscription. Only active subscriptions can be paused.
    ///
    /// # Arguments
    ///
    /// * `id` - Subscription ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn pause(&self, id: &String, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/subscriptions/{}/pause", id),
            None,
            None,
            options,
        ).await
    }

    /// Resume a previously paused subscription back to active status.
    ///
    /// # Arguments
    ///
    /// * `id` - Subscription ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn resume(&self, id: &String, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/subscriptions/{}/resume", id),
            None,
            None,
            options,
        ).await
    }

    /// Switch a subscription to a different plan. The new plan must have a price for the subscription's currency. A new billing period starts immediately with the new plan.
    ///
    /// # Arguments
    ///
    /// * `id` - Subscription ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn change_plan(&self, id: &String, request: &ChangePlanDto, options: Option<RequestOptions>) -> Result<SubscriptionResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/subscriptions/{}/change-plan", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

}

