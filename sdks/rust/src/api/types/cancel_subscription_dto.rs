pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct CancelSubscriptionDto {
    /// When to cancel: immediately or at end of current period
    #[serde(rename = "cancelAt")]
    pub cancel_at: CancelSubscriptionDtoCancelAt,
}
