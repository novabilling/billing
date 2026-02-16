pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct TestSMTPTenantsRequest {
    /// Recipient email address
    pub to: String,
}
