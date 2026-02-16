pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct AddOnPriceResponse {
    pub id: String,
    #[serde(rename = "addOnId")]
    pub add_on_id: String,
    pub currency: String,
    /// Decimal amount as string
    pub amount: String,
}