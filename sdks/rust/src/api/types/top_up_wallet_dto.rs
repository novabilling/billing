pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TopUpWalletDto {
    #[serde(rename = "walletId")]
    pub wallet_id: String,
    /// Paid credits to purchase
    #[serde(rename = "paidCredits")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub paid_credits: Option<f64>,
    /// Free credits to grant
    #[serde(rename = "grantedCredits")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub granted_credits: Option<f64>,
    /// Credits to void
    #[serde(rename = "voidedCredits")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub voided_credits: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
}
