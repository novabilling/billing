pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreatePaymentDto {
    /// Invoice ID this payment is for
    #[serde(rename = "invoiceId")]
    pub invoice_id: String,
    /// Payment provider name (e.g. stripe, paystack, manual)
    pub provider: String,
    /// Payment amount
    pub amount: f64,
    /// Currency
    pub currency: String,
    /// Payment status
    pub status: CreatePaymentDtoStatus,
    /// Provider transaction ID
    #[serde(rename = "providerTransactionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider_transaction_id: Option<String>,
    /// Failure reason (for FAILED payments)
    #[serde(rename = "failureReason")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub failure_reason: Option<String>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
