pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateEventDto {
    /// Unique transaction ID for idempotency
    #[serde(rename = "transactionId")]
    pub transaction_id: String,
    /// Subscription ID or external subscription ID
    #[serde(rename = "subscriptionId")]
    pub subscription_id: String,
    /// Billable metric code
    pub code: String,
    /// Event timestamp (defaults to now)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<String>,
    /// Event properties
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
}