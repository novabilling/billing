pub use crate::prelude::*;

/// Query parameters for list
///
/// Request type for the CustomersListQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct CustomersListQueryRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
    /// Search by name or email
    #[serde(skip_serializing_if = "Option::is_none")]
    pub search: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub country: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,
    #[serde(rename = "sortBy")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sort_by: Option<String>,
    #[serde(rename = "sortOrder")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<ListCustomersRequestSortOrder>,
}
