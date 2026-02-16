pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaymentResponse {
    pub id: String,
    #[serde(rename = "invoiceId")]
    pub invoice_id: String,
    pub provider: String,
    #[serde(rename = "providerTransactionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider_transaction_id: Option<String>,
    /// Decimal amount as string
    pub amount: String,
    pub currency: String,
    pub status: PaymentResponseStatus,
    #[serde(rename = "failureReason")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub failure_reason: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}