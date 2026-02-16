use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct PaymentMethodsClient {
    pub http_client: HttpClient,
}

impl PaymentMethodsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    pub async fn list(&self, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/payment-methods",
            None,
            None,
            options,
        ).await
    }

    pub async fn create(&self, request: &CreatePaymentMethodDto, options: Option<RequestOptions>) -> Result<PaymentMethodResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/payment-methods",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get_by_customer(&self, customer_id: &String, options: Option<RequestOptions>) -> Result<Vec<PaymentMethodResponse>, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/payment-methods/customer/{}", customer_id),
            None,
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<PaymentMethodResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/payment-methods/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<(), ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/payment-methods/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn set_default(&self, id: &String, options: Option<RequestOptions>) -> Result<PaymentMethodResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/payment-methods/{}/set-default", id),
            None,
            None,
            options,
        ).await
    }

}

