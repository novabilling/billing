pub use crate::prelude::*;

/// Query parameters for getBySubscription
///
/// Request type for the GetBySubscriptionQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct GetBySubscriptionQueryRequest {
    /// Filter by metric code
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,
    /// Start date (ISO 8601)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub from: Option<String>,
    /// End date (ISO 8601)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub to: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(rename = "perPage")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub per_page: Option<f64>,
}
