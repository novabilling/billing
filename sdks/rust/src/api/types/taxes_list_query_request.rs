pub use crate::prelude::*;

/// Query parameters for list
///
/// Request type for the TaxesListQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct TaxesListQueryRequest {
    #[serde(rename = "appliedByDefault")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub applied_by_default: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
}
