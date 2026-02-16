pub use crate::prelude::*;

/// Query parameters for list
///
/// Request type for the PlansListQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct PlansListQueryRequest {
    /// Filter by active status
    #[serde(rename = "isActive")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_active: Option<bool>,
}
