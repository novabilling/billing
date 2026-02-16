use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct TaxesClient {
    pub http_client: HttpClient,
}

impl TaxesClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    pub async fn list(&self, request: &TaxesListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedTaxResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/taxes",
            None,
            QueryBuilder::new().bool("appliedByDefault", request.applied_by_default.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a new tax rate. Set appliedByDefault to automatically apply to all invoices.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateTaxDto, options: Option<RequestOptions>) -> Result<TaxResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/taxes",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<TaxResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/taxes/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/taxes/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn update(&self, id: &String, request: &UpdateTaxDto, options: Option<RequestOptions>) -> Result<TaxResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/taxes/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn taxes_controller_get_customer_taxes(&self, customer_id: &String, options: Option<RequestOptions>) -> Result<Vec<TaxResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/taxes/customer/{}", customer_id),
            None,
            None,
            options,
        ).await
    }

    pub async fn assign_to_customer(&self, customer_id: &String, request: &AssignTaxDto, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/taxes/customer/{}", customer_id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn remove_from_customer(&self, customer_id: &String, tax_id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/taxes/customer/{}/{}", customer_id, tax_id),
            None,
            None,
            options,
        ).await
    }

    pub async fn taxes_controller_get_plan_taxes(&self, plan_id: &String, options: Option<RequestOptions>) -> Result<Vec<TaxResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/taxes/plan/{}", plan_id),
            None,
            None,
            options,
        ).await
    }

    pub async fn assign_to_plan(&self, plan_id: &String, request: &AssignTaxDto, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/taxes/plan/{}", plan_id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn remove_from_plan(&self, plan_id: &String, tax_id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/taxes/plan/{}/{}", plan_id, tax_id),
            None,
            None,
            options,
        ).await
    }

    pub async fn assign_to_charge(&self, charge_id: &String, request: &AssignTaxDto, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/taxes/charge/{}", charge_id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn remove_from_charge(&self, charge_id: &String, tax_id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/taxes/charge/{}/{}", charge_id, tax_id),
            None,
            None,
            options,
        ).await
    }

}

