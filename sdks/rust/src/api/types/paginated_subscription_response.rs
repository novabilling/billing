pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedSubscriptionResponse {
    pub data: Vec<SubscriptionResponse>,
    pub meta: PaginationMeta,
}