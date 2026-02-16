pub use crate::prelude::*;

/// Query parameters for getInvoices
///
/// Request type for the GetInvoicesQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct GetInvoicesQueryRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<GetInvoicesPortalRequestStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
}
