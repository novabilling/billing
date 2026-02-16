pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdatePlanOverrideDto {
    /// Override plan prices
    #[serde(rename = "overriddenPrices")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_prices: Option<Vec<String>>,
    /// Override minimum commitment amount
    #[serde(rename = "overriddenMinimumCommitment")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_minimum_commitment: Option<f64>,
    /// Override charge properties
    #[serde(rename = "overriddenCharges")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_charges: Option<Vec<String>>,
    /// Custom metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
}
