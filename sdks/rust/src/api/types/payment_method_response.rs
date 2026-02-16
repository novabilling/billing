pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaymentMethodResponse {
    pub id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    pub provider: String,
    pub r#type: String,
    #[serde(rename = "tokenId")]
    pub token_id: String,
    #[serde(rename = "isDefault")]
    pub is_default: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last4: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
    #[serde(rename = "expMonth")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub exp_month: Option<f64>,
    #[serde(rename = "expYear")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub exp_year: Option<f64>,
    #[serde(rename = "cardholderName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cardholder_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub country: Option<String>,
    #[serde(rename = "createdAt")]
    #[serde(with = "crate::core::flexible_datetime::offset")]
    pub created_at: DateTime<FixedOffset>,
    #[serde(rename = "updatedAt")]
    #[serde(with = "crate::core::flexible_datetime::offset")]
    pub updated_at: DateTime<FixedOffset>,
}