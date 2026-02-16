pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateWalletDto {
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    pub currency: String,
    /// 1 credit = rateAmount in currency
    #[serde(rename = "rateAmount")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rate_amount: Option<f64>,
    /// Paid credits (purchase)
    #[serde(rename = "paidCredits")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub paid_credits: Option<f64>,
    /// Free credits (grant)
    #[serde(rename = "grantedCredits")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub granted_credits: Option<f64>,
    /// Expiration date (ISO 8601)
    #[serde(rename = "expirationAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expiration_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
