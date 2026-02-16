pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum GetInvoicesPortalRequestStatus {
    #[serde(rename = "PENDING")]
    Pending,
    #[serde(rename = "PAID")]
    Paid,
    #[serde(rename = "FAILED")]
    Failed,
    #[serde(rename = "CANCELED")]
    Canceled,
}
impl fmt::Display for GetInvoicesPortalRequestStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Pending => "PENDING",
            Self::Paid => "PAID",
            Self::Failed => "FAILED",
            Self::Canceled => "CANCELED",
        };
        write!(f, "{}", s)
    }
}
