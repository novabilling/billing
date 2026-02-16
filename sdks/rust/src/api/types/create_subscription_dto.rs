pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateSubscriptionDto {
    /// Customer ID
    #[serde(rename = "customerId")]
    pub customer_id: String,
    /// Plan ID
    #[serde(rename = "planId")]
    pub plan_id: String,
    /// Currency for billing
    pub currency: String,
    /// Number of trial days
    #[serde(rename = "trialDays")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub trial_days: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    /// Override subscription start date (ISO 8601). Defaults to now.
    #[serde(rename = "startDate")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_date: Option<String>,
    /// Override current period end (ISO 8601). Defaults to calculated from startDate + billing interval.
    #[serde(rename = "currentPeriodEnd")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub current_period_end: Option<String>,
    /// Override subscription status for imports
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<CreateSubscriptionDtoStatus>,
    /// Backdate createdAt (ISO 8601). For data imports.
    #[serde(rename = "createdAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    /// External ID for linking to external systems
    #[serde(rename = "externalId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub external_id: Option<String>,
    /// Canceled at date (ISO 8601). For importing canceled subscriptions.
    #[serde(rename = "canceledAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub canceled_at: Option<String>,
}
