pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct MrrBreakdownResponse {
    #[serde(rename = "totalMrr")]
    pub total_mrr: f64,
    #[serde(rename = "newMrr")]
    pub new_mrr: f64,
    #[serde(rename = "expansionMrr")]
    pub expansion_mrr: f64,
    #[serde(rename = "contractionMrr")]
    pub contraction_mrr: f64,
    #[serde(rename = "churnMrr")]
    pub churn_mrr: f64,
    #[serde(rename = "netNewMrr")]
    pub net_new_mrr: f64,
    #[serde(rename = "byPlan")]
    pub by_plan: Vec<MrrPlanBreakdown>,
}