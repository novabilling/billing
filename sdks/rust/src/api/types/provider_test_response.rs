pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct ProviderTestResponse {
    pub success: bool,
    pub message: String,
}