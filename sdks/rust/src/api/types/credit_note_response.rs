pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreditNoteResponse {
    pub id: String,
    #[serde(rename = "invoiceId")]
    pub invoice_id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Decimal amount as string
    pub amount: String,
    pub currency: String,
    pub reason: CreditNoteResponseReason,
    pub status: CreditNoteResponseStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}