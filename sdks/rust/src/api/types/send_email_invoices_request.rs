pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct SendEmailInvoicesRequest {
    /// Recipient email address. Defaults to the customer email if omitted.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
}
