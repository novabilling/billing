pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ChargeFilterResponse {
    pub id: String,
    #[serde(rename = "chargeId")]
    pub charge_id: String,
    pub key: String,
    pub values: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
}