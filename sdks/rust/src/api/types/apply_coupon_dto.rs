pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ApplyCouponDto {
    #[serde(rename = "couponId")]
    pub coupon_id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(rename = "subscriptionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subscription_id: Option<String>,
    /// Number of billing cycles to apply (null = forever)
    #[serde(rename = "usesRemaining")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uses_remaining: Option<f64>,
}
