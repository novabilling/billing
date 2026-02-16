pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdateAddOnDto {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "invoiceDisplayName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_display_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prices: Option<Vec<AddOnPriceDto>>,
}
