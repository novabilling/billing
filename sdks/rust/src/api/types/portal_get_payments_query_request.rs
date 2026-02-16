pub use crate::prelude::*;

/// Query parameters for getPayments
///
/// Request type for the PortalGetPaymentsQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct PortalGetPaymentsQueryRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
}
