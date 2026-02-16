pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedUsageEventResponse {
    pub data: Vec<UsageEventResponse>,
    pub meta: PaginationMeta,
}