pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateChargeDto {
    /// Plan ID to attach this charge to
    #[serde(rename = "planId")]
    pub plan_id: String,
    /// Billable metric ID
    #[serde(rename = "billableMetricId")]
    pub billable_metric_id: String,
    #[serde(rename = "chargeModel")]
    pub charge_model: CreateChargeDtoChargeModel,
    #[serde(rename = "billingTiming")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub billing_timing: Option<CreateChargeDtoBillingTiming>,
    /// Display name on invoices
    #[serde(rename = "invoiceDisplayName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_display_name: Option<String>,
    /// Minimum charge in cents
    #[serde(rename = "minAmountCents")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_amount_cents: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prorated: Option<bool>,
    /// Model-specific config. Standard: { amount, currency }. Package: { amount, packageSize, currency }. Percentage: { rate, fixedAmount, freeUnitsPerEvent, freeUnitsPerTotalAggregation }
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
    /// Required for GRADUATED and VOLUME charge models
    #[serde(rename = "graduatedRanges")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub graduated_ranges: Option<Vec<GraduatedRangeDto>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filters: Option<Vec<ChargeFilterDto>>,
}
