pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedWalletTransactionResponse {
    pub data: Vec<WalletTransactionResponse>,
    pub meta: PaginationMeta,
}