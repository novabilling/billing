pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PlanOverrideResponse {
    pub id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(rename = "planId")]
    pub plan_id: String,
    #[serde(rename = "overriddenPrices")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_prices: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "overriddenMinimumCommitment")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_minimum_commitment: Option<f64>,
    #[serde(rename = "overriddenCharges")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub overridden_charges: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "createdAt")]
    #[serde(with = "crate::core::flexible_datetime::offset")]
    pub created_at: DateTime<FixedOffset>,
    #[serde(rename = "updatedAt")]
    #[serde(with = "crate::core::flexible_datetime::offset")]
    pub updated_at: DateTime<FixedOffset>,
}