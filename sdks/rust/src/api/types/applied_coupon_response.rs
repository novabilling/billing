pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AppliedCouponResponse {
    pub id: String,
    #[serde(rename = "couponId")]
    pub coupon_id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(rename = "subscriptionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subscription_id: Option<String>,
    #[serde(rename = "amountOff")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub amount_off: Option<String>,
    #[serde(rename = "usesRemaining")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uses_remaining: Option<f64>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}