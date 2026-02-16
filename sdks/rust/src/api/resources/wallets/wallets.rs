use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct WalletsClient {
    pub http_client: HttpClient,
}

impl WalletsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// List wallets, optionally filtered by customer or status.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &WalletsListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedWalletResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/wallets",
            None,
            QueryBuilder::new().string("customerId", request.customer_id.clone()).serialize("status", request.status.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a prepaid credit wallet for a customer. Optionally seed it with paid or granted credits.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateWalletDto, options: Option<RequestOptions>) -> Result<WalletResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/wallets",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<WalletResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/wallets/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Terminate a wallet. Remaining credits are voided.
    ///
    /// # Arguments
    ///
    /// * `id` - Wallet ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn delete(&self, id: &String, options: Option<RequestOptions>) -> Result<WalletResponse, ApiError> {
        self.http_client.execute_request(
            Method::DELETE,
            &format!("api/wallets/{}", id),
            None,
            None,
            options,
        ).await
    }

    /// Update wallet name, expiration, or metadata.
    ///
    /// # Arguments
    ///
    /// * `id` - Wallet ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn update(&self, id: &String, request: &UpdateWalletDto, options: Option<RequestOptions>) -> Result<WalletResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/wallets/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Add paid/granted credits or void existing credits from a wallet.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create_transaction(&self, request: &TopUpWalletDto, options: Option<RequestOptions>) -> Result<TopUpResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/wallets/transactions",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get_transactions(&self, id: &String, request: &GetTransactionsQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedWalletTransactionResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/wallets/{}/transactions", id),
            None,
            QueryBuilder::new().serialize("status", request.status.clone()).serialize("transactionStatus", request.transaction_status.clone()).serialize("transactionType", request.transaction_type.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

}

