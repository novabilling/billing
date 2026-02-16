pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdateChargeDto {
    #[serde(rename = "billingTiming")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub billing_timing: Option<UpdateChargeDtoBillingTiming>,
    #[serde(rename = "invoiceDisplayName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_display_name: Option<String>,
    #[serde(rename = "minAmountCents")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_amount_cents: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prorated: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<HashMap<String, serde_json::Value>>,
    #[serde(rename = "graduatedRanges")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub graduated_ranges: Option<Vec<GraduatedRangeDto>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filters: Option<Vec<ChargeFilterDto>>,
}
