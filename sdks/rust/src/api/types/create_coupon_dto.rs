pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateCouponDto {
    /// Unique coupon code
    pub code: String,
    /// Display name
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "discountType")]
    pub discount_type: CreateCouponDtoDiscountType,
    /// Discount value (percentage 0-100 or fixed amount)
    #[serde(rename = "discountValue")]
    pub discount_value: f64,
    /// Currency for FIXED_AMOUNT discounts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,
    /// Max number of redemptions (null = unlimited)
    #[serde(rename = "maxRedemptions")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_redemptions: Option<f64>,
    /// Plan IDs this coupon applies to (empty = all)
    #[serde(rename = "appliesToPlanIds")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub applies_to_plan_ids: Option<Vec<String>>,
    #[serde(rename = "expiresAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
