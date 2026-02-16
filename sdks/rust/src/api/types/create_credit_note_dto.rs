pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateCreditNoteDto {
    /// Invoice ID to credit against
    #[serde(rename = "invoiceId")]
    pub invoice_id: String,
    /// Customer ID
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Credit amount
    pub amount: f64,
    /// Currency
    pub currency: String,
    pub reason: CreateCreditNoteDtoReason,
    /// Additional metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    /// Override status for imports
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<CreateCreditNoteDtoStatus>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
