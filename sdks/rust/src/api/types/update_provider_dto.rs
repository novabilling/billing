pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdateProviderDto {
    /// Provider name
    #[serde(rename = "providerName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider_name: Option<String>,
    /// Provider credentials (will be encrypted)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub credentials: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "isActive")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_active: Option<bool>,
    /// Priority (lower = higher)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<f64>,
}
