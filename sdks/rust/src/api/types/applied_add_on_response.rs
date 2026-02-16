pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct AppliedAddOnResponse {
    pub id: String,
    #[serde(rename = "addOnId")]
    pub add_on_id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(rename = "subscriptionId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subscription_id: Option<String>,
    pub amount: String,
    pub currency: String,
    #[serde(rename = "invoiceId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_id: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}