pub use crate::prelude::*;

/// Payment status
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreatePaymentDtoStatus {
    #[serde(rename = "PROCESSING")]
    Processing,
    #[serde(rename = "SUCCEEDED")]
    Succeeded,
    #[serde(rename = "FAILED")]
    Failed,
    #[serde(rename = "REFUNDED")]
    Refunded,
}
impl fmt::Display for CreatePaymentDtoStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Processing => "PROCESSING",
            Self::Succeeded => "SUCCEEDED",
            Self::Failed => "FAILED",
            Self::Refunded => "REFUNDED",
        };
        write!(f, "{}", s)
    }
}
