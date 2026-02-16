use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct BillableMetricsClient {
    pub http_client: HttpClient,
}

impl BillableMetricsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve all billable metrics with their filters and charge counts.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, options: Option<RequestOptions>) -> Result<Vec<BillableMetricResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/billable-metrics",
            None,
            None,
            options,
        ).await
    }

    /// Create a new billable metric for usage-based billing. Supported aggregation types: COUNT, SUM, MAX, UNIQUE_COUNT, LATEST, WEIGHTED_SUM.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateBillableMetricDto, options: Option<RequestOptions>) -> Result<BillableMetricResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/billable-metrics",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Retrieve a billable metric with its filters and associated charges.
    ///
    /// # Arguments
    ///
    /// * `id` - Billable Metric ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<BillableMetricResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/billable-metrics/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Delete a billable metric. Metrics used in charges cannot be deleted.
    ///
    /// # Arguments
    ///
    /// * `id` - Billable Metric ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<BillableMetricResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/billable-metrics/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update billable metric details. Code and aggregation type cannot be changed.
    ///
    /// # Arguments
    ///
    /// * `id` - Billable Metric ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdateBillableMetricDto, options: Option<RequestOptions>) -> Result<BillableMetricResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/billable-metrics/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

}

