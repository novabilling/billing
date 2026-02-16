pub use crate::prelude::*;

/// Query parameters for list
///
/// Request type for the PaymentsListQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct PaymentsListQueryRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,
    #[serde(rename = "invoiceId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_id: Option<String>,
    #[serde(rename = "dateFrom")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_from: Option<String>,
    #[serde(rename = "dateTo")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_to: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
}
