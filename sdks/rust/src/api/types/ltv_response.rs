pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LtvResponse {
    #[serde(rename = "avgLtv")]
    pub avg_ltv: f64,
    #[serde(rename = "avgLifespanDays")]
    pub avg_lifespan_days: f64,
    #[serde(rename = "byPlan")]
    pub by_plan: Vec<LtvPlanBreakdown>,
}