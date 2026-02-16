pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedPaymentResponse {
    pub data: Vec<PaymentResponse>,
    pub meta: PaginationMeta,
}