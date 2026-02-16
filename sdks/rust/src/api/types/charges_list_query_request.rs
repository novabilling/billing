pub use crate::prelude::*;

/// Query parameters for list
///
/// Request type for the ChargesListQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct ChargesListQueryRequest {
    /// Filter by plan ID
    #[serde(rename = "planId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plan_id: Option<String>,
}
