pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct GraduatedRangeDto {
    /// Start of range (inclusive)
    #[serde(rename = "fromValue")]
    pub from_value: f64,
    /// End of range (inclusive), null = infinity
    #[serde(rename = "toValue")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub to_value: Option<f64>,
    /// Price per unit in this range
    #[serde(rename = "perUnitAmount")]
    pub per_unit_amount: f64,
    /// Flat fee for entering this range
    #[serde(rename = "flatAmount")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub flat_amount: Option<f64>,
}