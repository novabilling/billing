use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct EventsClient {
    pub http_client: HttpClient,
}

impl EventsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    pub async fn list(&self, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/events",
            None,
            None,
            options,
        ).await
    }

    /// Send a single usage event. Uses transactionId for idempotency - sending the same transactionId twice will return the existing event.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateEventDto, options: Option<RequestOptions>) -> Result<UsageEventResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/events",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Send up to 100 usage events in a single request. Each event is processed independently - failures do not affect other events.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create_batch(&self, request: &BatchEventsDto, options: Option<RequestOptions>) -> Result<BatchEventResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/events/batch",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve a single usage event by its ID.
    ///
    /// # Arguments
    ///
    /// * `id` - Event ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<UsageEventResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/events/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Retrieve usage events for a specific subscription with optional filtering.
    ///
    /// # Arguments
    ///
    /// * `subscription_id` - Subscription ID
    /// * `code` - Filter by metric code
    /// * `from` - Start date (ISO 8601)
    /// * `to` - End date (ISO 8601)
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_by_subscription(&self, subscription_id: &String, request: &GetBySubscriptionQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedUsageEventResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/events/subscription/{}", subscription_id),
            None,
            QueryBuilder::new().string("code", request.code.clone()).string("from", request.from.clone()).string("to", request.to.clone()).float("page", request.page.clone()).float("perPage", request.per_page.clone())
            .build(),
            options,
        ).await
    }

}

