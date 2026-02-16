pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdateTenantDto {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    #[serde(rename = "webhookUrl")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub webhook_url: Option<String>,
    /// Custom tenant settings (merged with existing)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<HashMap<String, serde_json::Value>>,
}
