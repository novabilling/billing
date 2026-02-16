pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ChargeGraduatedRangeResponse {
    pub id: String,
    #[serde(rename = "chargeId")]
    pub charge_id: String,
    #[serde(rename = "fromValue")]
    pub from_value: f64,
    #[serde(rename = "toValue")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub to_value: Option<f64>,
    /// Per-unit amount as decimal string
    #[serde(rename = "perUnitAmount")]
    pub per_unit_amount: String,
    /// Flat fee for this range
    #[serde(rename = "flatAmount")]
    pub flat_amount: String,
    pub order: f64,
}