pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum ListCreditNotesRequestStatus {
    #[serde(rename = "DRAFT")]
    Draft,
    #[serde(rename = "FINALIZED")]
    Finalized,
    #[serde(rename = "VOIDED")]
    Voided,
}
impl fmt::Display for ListCreditNotesRequestStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Draft => "DRAFT",
            Self::Finalized => "FINALIZED",
            Self::Voided => "VOIDED",
        };
        write!(f, "{}", s)
    }
}
