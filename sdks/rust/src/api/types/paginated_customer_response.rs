pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedCustomerResponse {
    pub data: Vec<CustomerResponse>,
    pub meta: PaginationMeta,
}