pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedPlanOverrideResponse {
    pub data: Vec<PlanOverrideResponse>,
    pub meta: HashMap<String, serde_json::Value>,
}