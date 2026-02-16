pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct MrrPlanBreakdown {
    #[serde(rename = "planId")]
    pub plan_id: String,
    #[serde(rename = "planName")]
    pub plan_name: String,
    pub mrr: f64,
    #[serde(rename = "subscriptionCount")]
    pub subscription_count: f64,
}