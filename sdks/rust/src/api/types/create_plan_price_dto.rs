pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreatePlanPriceDto {
    /// ISO currency code
    pub currency: String,
    /// Price amount
    pub amount: f64,
}