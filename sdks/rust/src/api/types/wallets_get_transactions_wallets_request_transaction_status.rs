pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum GetTransactionsWalletsRequestTransactionStatus {
    #[serde(rename = "PURCHASED")]
    Purchased,
    #[serde(rename = "GRANTED")]
    Granted,
    #[serde(rename = "VOIDED")]
    Voided,
    #[serde(rename = "INVOICED")]
    Invoiced,
}
impl fmt::Display for GetTransactionsWalletsRequestTransactionStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Purchased => "PURCHASED",
            Self::Granted => "GRANTED",
            Self::Voided => "VOIDED",
            Self::Invoiced => "INVOICED",
        };
        write!(f, "{}", s)
    }
}
