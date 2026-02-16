pub use crate::prelude::*;

/// Query parameters for list
///
/// Request type for the CreditNotesListQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct CreditNotesListQueryRequest {
    #[serde(rename = "customerId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer_id: Option<String>,
    #[serde(rename = "invoiceId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<ListCreditNotesRequestStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<f64>,
}
