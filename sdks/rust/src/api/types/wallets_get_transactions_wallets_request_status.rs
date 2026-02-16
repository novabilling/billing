pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum GetTransactionsWalletsRequestStatus {
    #[serde(rename = "PENDING")]
    Pending,
    #[serde(rename = "SETTLED")]
    Settled,
    #[serde(rename = "FAILED")]
    Failed,
}
impl fmt::Display for GetTransactionsWalletsRequestStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Pending => "PENDING",
            Self::Settled => "SETTLED",
            Self::Failed => "FAILED",
        };
        write!(f, "{}", s)
    }
}
