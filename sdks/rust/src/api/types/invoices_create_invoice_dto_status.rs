pub use crate::prelude::*;

/// Override invoice status for imports
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreateInvoiceDtoStatus {
    #[serde(rename = "DRAFT")]
    Draft,
    #[serde(rename = "PENDING")]
    Pending,
    #[serde(rename = "PAID")]
    Paid,
    #[serde(rename = "FAILED")]
    Failed,
    #[serde(rename = "CANCELED")]
    Canceled,
}
impl fmt::Display for CreateInvoiceDtoStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Draft => "DRAFT",
            Self::Pending => "PENDING",
            Self::Paid => "PAID",
            Self::Failed => "FAILED",
            Self::Canceled => "CANCELED",
        };
        write!(f, "{}", s)
    }
}
