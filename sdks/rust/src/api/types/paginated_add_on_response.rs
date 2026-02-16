pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedAddOnResponse {
    pub data: Vec<AddOnResponse>,
    pub meta: PaginationMeta,
}