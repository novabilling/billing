pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LtvPlanBreakdown {
    #[serde(rename = "planId")]
    pub plan_id: String,
    #[serde(rename = "planName")]
    pub plan_name: String,
    #[serde(rename = "avgLtv")]
    pub avg_ltv: f64,
    #[serde(rename = "avgLifespanDays")]
    pub avg_lifespan_days: f64,
}