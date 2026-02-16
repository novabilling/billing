pub use crate::prelude::*;

/// Query parameters for getTransactions
///
/// Request type for the GetTransactionsQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct GetTransactionsQueryRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<GetTransactionsWalletsRequestStatus>,
    #[serde(rename = "transactionStatus")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub transaction_status: Option<GetTransactionsWalletsRequestTransactionStatus>,
    #[serde(rename = "transactionType")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub transaction_type: Option<GetTransactionsWalletsRequestTransactionType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
}
