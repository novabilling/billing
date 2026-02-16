pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CouponResponse {
    pub id: String,
    pub code: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "discountType")]
    pub discount_type: CouponResponseDiscountType,
    /// Discount value as decimal string
    #[serde(rename = "discountValue")]
    pub discount_value: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,
    #[serde(rename = "maxRedemptions")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_redemptions: Option<f64>,
    #[serde(rename = "redemptionCount")]
    pub redemption_count: f64,
    #[serde(rename = "appliesToPlanIds")]
    pub applies_to_plan_ids: Vec<String>,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    #[serde(rename = "expiresAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}