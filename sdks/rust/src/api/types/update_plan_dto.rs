pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct UpdatePlanDto {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "billingInterval")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub billing_interval: Option<UpdatePlanDtoBillingInterval>,
    /// When to charge: IN_ADVANCE or IN_ARREARS
    #[serde(rename = "billingTiming")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub billing_timing: Option<UpdatePlanDtoBillingTiming>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub features: Option<Vec<String>>,
    #[serde(rename = "isActive")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_active: Option<bool>,
    /// Net payment terms in days
    #[serde(rename = "netPaymentTerms")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub net_payment_terms: Option<f64>,
    /// Grace period in days before draft invoices are finalized
    #[serde(rename = "invoiceGracePeriodDays")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_grace_period_days: Option<f64>,
    /// Usage cost threshold for progressive billing
    #[serde(rename = "progressiveBillingThreshold")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub progressive_billing_threshold: Option<f64>,
}
