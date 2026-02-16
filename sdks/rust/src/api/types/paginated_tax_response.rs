pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedTaxResponse {
    pub data: Vec<TaxResponse>,
    pub meta: PaginationMeta,
}