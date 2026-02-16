pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct InvoiceItemDto {
    pub description: String,
    pub quantity: f64,
    #[serde(rename = "unitAmount")]
    pub unit_amount: f64,
}