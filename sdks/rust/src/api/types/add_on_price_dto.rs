pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AddOnPriceDto {
    /// ISO 4217 currency code
    pub currency: String,
    /// Price amount
    pub amount: f64,
}