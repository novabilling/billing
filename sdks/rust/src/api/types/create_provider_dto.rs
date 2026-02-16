pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateProviderDto {
    /// Provider name
    #[serde(rename = "providerName")]
    pub provider_name: String,
    /// Provider credentials (will be encrypted)
    pub credentials: HashMap<String, serde_json::Value>,
    #[serde(rename = "isActive")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_active: Option<bool>,
    /// Priority (lower = higher)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<f64>,
}
