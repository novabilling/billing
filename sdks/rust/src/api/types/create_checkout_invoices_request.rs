pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct CreateCheckoutInvoicesRequest {
    /// URL to redirect customer after payment
    #[serde(rename = "callbackUrl")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub callback_url: Option<String>,
}
