pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreatePaymentMethodDtoType {
    #[serde(rename = "CARD")]
    Card,
    #[serde(rename = "BANK_ACCOUNT")]
    BankAccount,
    #[serde(rename = "WALLET")]
    Wallet,
}
impl fmt::Display for CreatePaymentMethodDtoType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Card => "CARD",
            Self::BankAccount => "BANK_ACCOUNT",
            Self::Wallet => "WALLET",
        };
        write!(f, "{}", s)
    }
}
