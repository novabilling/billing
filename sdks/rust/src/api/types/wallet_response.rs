pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct WalletResponse {
    pub id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    pub currency: String,
    /// 1 credit = rateAmount in currency
    #[serde(rename = "rateAmount")]
    pub rate_amount: String,
    /// Available credits
    #[serde(rename = "creditsBalance")]
    pub credits_balance: String,
    /// Monetary equivalent of credits
    pub balance: String,
    /// Lifetime consumed credits
    #[serde(rename = "consumedCredits")]
    pub consumed_credits: String,
    /// Lifetime consumed amount
    #[serde(rename = "consumedAmount")]
    pub consumed_amount: String,
    pub status: WalletResponseStatus,
    #[serde(rename = "expirationAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expiration_at: Option<String>,
    #[serde(rename = "terminatedAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub terminated_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer: Option<WalletCustomerResponse>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}