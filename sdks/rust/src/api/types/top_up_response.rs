pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TopUpResponse {
    pub transactions: Vec<WalletTransactionResponse>,
    pub wallet: WalletResponse,
}