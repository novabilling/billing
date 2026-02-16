pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreditNoteResponseReason {
    #[serde(rename = "DUPLICATE")]
    Duplicate,
    #[serde(rename = "PRODUCT_UNSATISFACTORY")]
    ProductUnsatisfactory,
    #[serde(rename = "ORDER_CHANGE")]
    OrderChange,
    #[serde(rename = "OTHER")]
    Other,
}
impl fmt::Display for CreditNoteResponseReason {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Duplicate => "DUPLICATE",
            Self::ProductUnsatisfactory => "PRODUCT_UNSATISFACTORY",
            Self::OrderChange => "ORDER_CHANGE",
            Self::Other => "OTHER",
        };
        write!(f, "{}", s)
    }
}
