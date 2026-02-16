pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedCouponResponse {
    pub data: Vec<CouponResponse>,
    pub meta: PaginationMeta,
}