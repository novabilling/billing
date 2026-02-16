pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum WalletTransactionResponseTransactionType {
    #[serde(rename = "INBOUND")]
    Inbound,
    #[serde(rename = "OUTBOUND")]
    Outbound,
}
impl fmt::Display for WalletTransactionResponseTransactionType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Inbound => "INBOUND",
            Self::Outbound => "OUTBOUND",
        };
        write!(f, "{}", s)
    }
}
