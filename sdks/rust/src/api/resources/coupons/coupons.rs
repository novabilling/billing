use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct CouponsClient {
    pub http_client: HttpClient,
}

impl CouponsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of coupons.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &CouponsListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedCouponResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/coupons",
            None,
            QueryBuilder::new().bool("isActive", request.is_active.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a new discount coupon.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateCouponDto, options: Option<RequestOptions>) -> Result<CouponResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/coupons",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<CouponResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/coupons/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Delete or deactivate a coupon.
    ///
    /// # Arguments
    ///
    /// * `id` - Coupon ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<CouponResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/coupons/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn update(&self, id: &String, request: &UpdateCouponDto, options: Option<RequestOptions>) -> Result<CouponResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/coupons/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Apply a coupon to a specific customer, optionally linked to a subscription.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn apply(&self, request: &ApplyCouponDto, options: Option<RequestOptions>) -> Result<AppliedCouponResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/coupons/apply",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn remove_applied(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/coupons/applied/{}", id),
            None,
            None,
            options,
        ).await
    }

}

