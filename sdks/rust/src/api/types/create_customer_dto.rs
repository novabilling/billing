pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateCustomerDto {
    /// Tenant's user ID
    #[serde(rename = "externalId")]
    pub external_id: String,
    pub email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub country: Option<String>,
    /// ISO currency code
    pub currency: String,
    /// Custom metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    /// Net payment terms in days (overrides org and plan defaults)
    #[serde(rename = "netPaymentTerms")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub net_payment_terms: Option<f64>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
