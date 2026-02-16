pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct ChangePlanDto {
    /// New plan ID
    #[serde(rename = "newPlanId")]
    pub new_plan_id: String,
    /// Whether to prorate charges
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prorate: Option<bool>,
}
