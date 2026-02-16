pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ChargeResponse {
    pub id: String,
    #[serde(rename = "planId")]
    pub plan_id: String,
    #[serde(rename = "billableMetricId")]
    pub billable_metric_id: String,
    #[serde(rename = "chargeModel")]
    pub charge_model: ChargeResponseChargeModel,
    #[serde(rename = "billingTiming")]
    pub billing_timing: ChargeResponseBillingTiming,
    #[serde(rename = "invoiceDisplayName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_display_name: Option<String>,
    #[serde(rename = "minAmountCents")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_amount_cents: Option<f64>,
    pub prorated: bool,
    /// Model-specific config
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "graduatedRanges")]
    pub graduated_ranges: Vec<ChargeGraduatedRangeResponse>,
    pub filters: Vec<ChargeFilterResponse>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}