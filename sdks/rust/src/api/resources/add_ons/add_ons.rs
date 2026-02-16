use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct AddOnsClient {
    pub http_client: HttpClient,
}

impl AddOnsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of add-ons with prices.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &AddOnsListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedAddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/add-ons",
            None,
            QueryBuilder::new().float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a one-time charge add-on with multi-currency pricing.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateAddOnDto, options: Option<RequestOptions>) -> Result<AddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/add-ons",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<AddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/add-ons/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<AddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/add-ons/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn update(&self, id: &String, request: &UpdateAddOnDto, options: Option<RequestOptions>) -> Result<AddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/add-ons/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Create a one-time charge for a customer. Will be included in the next invoice.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn apply(&self, request: &ApplyAddOnDto, options: Option<RequestOptions>) -> Result<AppliedAddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/add-ons/apply",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// View one-time charges applied to customers.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list_applied(&self, request: &ListAppliedQueryRequest, options: Option<RequestOptions>) -> Result<Vec<AppliedAddOnResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/add-ons/applied/list",
            None,
            QueryBuilder::new().string("customerId", request.customer_id.clone()).bool("invoiced", request.invoiced.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Remove a one-time charge that has not yet been invoiced.
    ///
    /// # Arguments
    ///
    /// * `id` - Applied add-on ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn remove_applied(&self, id: &String, options: Option<RequestOptions>) -> Result<AppliedAddOnResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/add-ons/applied/{}", id),
            None,
            None,
            options,
        ).await
    }

}

