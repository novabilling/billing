pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdateCustomerDto {
    /// Tenant's user ID
    #[serde(rename = "externalId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub external_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub country: Option<String>,
    /// ISO currency code
    #[serde(skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,
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
