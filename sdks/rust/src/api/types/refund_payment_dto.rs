pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct RefundPaymentDto {
    /// Amount to refund (full refund if omitted)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub amount: Option<f64>,
    /// Reason for refund
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}
