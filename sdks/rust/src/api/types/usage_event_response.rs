pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct UsageEventResponse {
    pub id: String,
    #[serde(rename = "transactionId")]
    pub transaction_id: String,
    #[serde(rename = "subscriptionId")]
    pub subscription_id: String,
    pub code: String,
    pub timestamp: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}