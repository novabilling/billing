pub use crate::prelude::*;

/// Query parameters for getChurnCohorts
///
/// Request type for the GetChurnCohortsQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct GetChurnCohortsQueryRequest {
    /// Number of months to analyze (default 12)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub months: Option<f64>,
}
