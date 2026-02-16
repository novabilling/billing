pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaymentProviderResponse {
    pub id: String,
    #[serde(rename = "providerName")]
    pub provider_name: String,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    pub priority: f64,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}