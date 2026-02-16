pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreatePaymentMethodDto {
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Payment provider (stripe, paystack, flutterwave, dpo, payu, pesapal)
    pub provider: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<CreatePaymentMethodDtoType>,
    /// Provider-specific token/payment method ID
    #[serde(rename = "tokenId")]
    pub token_id: String,
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
}
