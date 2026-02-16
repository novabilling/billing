pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedCreditNoteResponse {
    pub data: Vec<CreditNoteResponse>,
    pub meta: PaginationMeta,
}