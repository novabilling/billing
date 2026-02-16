pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ApplyAddOnDto {
    /// Add-on ID
    #[serde(rename = "addOnId")]
    pub add_on_id: String,
    /// Customer ID
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Subscription to attach the charge to
    #[serde(rename = "subscriptionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subscription_id: Option<String>,
    /// Charge amount
    pub amount: f64,
    /// Currency
    pub currency: String,
}
