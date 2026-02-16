pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct CheckoutResponse {
    #[serde(rename = "checkoutUrl")]
    pub checkout_url: String,
    #[serde(rename = "paymentId")]
    pub payment_id: String,
    pub provider: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: String,
}