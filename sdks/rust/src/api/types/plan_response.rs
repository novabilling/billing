pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct PlanResponse {
    pub id: String,
    pub name: String,
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "billingInterval")]
    pub billing_interval: PlanResponseBillingInterval,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub features: Option<Vec<String>>,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    #[serde(rename = "billingTiming")]
    pub billing_timing: PlanResponseBillingTiming,
    /// Minimum commitment amount
    #[serde(rename = "minimumCommitment")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub minimum_commitment: Option<String>,
    pub prices: Vec<PlanPriceResponse>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}