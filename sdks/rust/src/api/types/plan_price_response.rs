pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct PlanPriceResponse {
    pub id: String,
    #[serde(rename = "planId")]
    pub plan_id: String,
    pub currency: String,
    /// Decimal amount as string
    pub amount: String,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}