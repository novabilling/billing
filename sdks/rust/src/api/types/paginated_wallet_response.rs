pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginatedWalletResponse {
    pub data: Vec<WalletResponse>,
    pub meta: PaginationMeta,
}