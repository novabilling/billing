pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum WalletResponseStatus {
    #[serde(rename = "ACTIVE")]
    Active,
    #[serde(rename = "TERMINATED")]
    Terminated,
}
impl fmt::Display for WalletResponseStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Active => "ACTIVE",
            Self::Terminated => "TERMINATED",
        };
        write!(f, "{}", s)
    }
}
