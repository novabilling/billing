pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct WalletTransactionResponse {
    pub id: String,
    #[serde(rename = "walletId")]
    pub wallet_id: String,
    #[serde(rename = "transactionType")]
    pub transaction_type: WalletTransactionResponseTransactionType,
    pub status: WalletTransactionResponseStatus,
    #[serde(rename = "transactionStatus")]
    pub transaction_status: WalletTransactionResponseTransactionStatus,
    /// Credits added or deducted
    #[serde(rename = "creditAmount")]
    pub credit_amount: String,
    /// Monetary equivalent
    pub amount: String,
    #[serde(rename = "invoiceId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_id: Option<String>,
    #[serde(rename = "settledAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settled_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}