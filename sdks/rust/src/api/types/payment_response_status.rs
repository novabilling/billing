pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum PaymentResponseStatus {
    #[serde(rename = "PENDING")]
    Pending,
    #[serde(rename = "PROCESSING")]
    Processing,
    #[serde(rename = "SUCCEEDED")]
    Succeeded,
    #[serde(rename = "FAILED")]
    Failed,
    #[serde(rename = "REFUNDED")]
    Refunded,
}
impl fmt::Display for PaymentResponseStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Pending => "PENDING",
            Self::Processing => "PROCESSING",
            Self::Succeeded => "SUCCEEDED",
            Self::Failed => "FAILED",
            Self::Refunded => "REFUNDED",
        };
        write!(f, "{}", s)
    }
}
