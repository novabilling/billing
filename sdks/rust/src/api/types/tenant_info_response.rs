pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TenantInfoResponse {
    pub id: String,
    pub name: String,
    pub slug: String,
    pub email: String,
    #[serde(rename = "apiKey")]
    pub api_key: String,
    #[serde(rename = "webhookUrl")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub webhook_url: Option<String>,
    #[serde(rename = "webhookSecret")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub webhook_secret: Option<String>,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "lastLoginAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_login_at: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}