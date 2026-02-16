pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateInvoiceDto {
    /// Customer ID
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Subscription ID (optional)
    #[serde(rename = "subscriptionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subscription_id: Option<String>,
    pub items: Vec<InvoiceItemDto>,
    /// Due date
    #[serde(rename = "dueDate")]
    pub due_date: String,
    /// Override invoice status for imports
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<CreateInvoiceDtoStatus>,
    /// Override invoice number (e.g. INV-00042). Auto-generated if omitted.
    #[serde(rename = "invoiceNumber")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_number: Option<String>,
    /// Currency override (defaults to customer currency)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,
    /// Paid at date (ISO 8601). For importing paid invoices.
    #[serde(rename = "paidAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub paid_at: Option<String>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
