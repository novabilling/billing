pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreatePlanDto {
    pub name: String,
    /// Unique plan code (lowercase, underscores)
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "billingInterval")]
    pub billing_interval: CreatePlanDtoBillingInterval,
    /// When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
    #[serde(rename = "billingTiming")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub billing_timing: Option<CreatePlanDtoBillingTiming>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub features: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prices: Option<Vec<CreatePlanPriceDto>>,
    /// Net payment terms in days (overrides org default)
    #[serde(rename = "netPaymentTerms")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub net_payment_terms: Option<f64>,
    /// Grace period in days before draft invoices are finalized
    #[serde(rename = "invoiceGracePeriodDays")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invoice_grace_period_days: Option<f64>,
    /// Usage cost threshold for mid-cycle progressive billing invoices
    #[serde(rename = "progressiveBillingThreshold")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub progressive_billing_threshold: Option<f64>,
}
