pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedInvoiceResponse {
    pub data: Vec<InvoiceResponse>,
    pub meta: PaginationMeta,
}