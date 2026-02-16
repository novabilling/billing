pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ChargeFilterDto {
    /// Filter key (must match metric filter)
    pub key: String,
    /// Subset of allowed values
    pub values: Vec<String>,
    /// Override properties for this filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
}