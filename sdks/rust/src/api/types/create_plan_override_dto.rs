pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreatePlanOverrideDto {
    /// Customer ID
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Plan ID
    #[serde(rename = "planId")]
    pub plan_id: String,
    /// Override plan prices: array of { currency, amount }
    #[serde(rename = "overriddenPrices")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_prices: Option<Vec<String>>,
    /// Override minimum commitment amount
    #[serde(rename = "overriddenMinimumCommitment")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_minimum_commitment: Option<f64>,
    /// Override charge properties: array of { chargeId, properties?, graduatedRanges? }
    #[serde(rename = "overriddenCharges")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_charges: Option<Vec<String>>,
    /// Custom metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
}
