pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SubscriptionResponse {
    pub id: String,
    #[serde(rename = "externalId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub external_id: Option<String>,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    #[serde(rename = "planId")]
    pub plan_id: String,
    #[serde(rename = "previousPlanId")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub previous_plan_id: Option<String>,
    pub status: SubscriptionResponseStatus,
    pub currency: String,
    #[serde(rename = "billingTiming")]
    pub billing_timing: SubscriptionResponseBillingTiming,
    #[serde(rename = "currentPeriodStart")]
    pub current_period_start: String,
    #[serde(rename = "currentPeriodEnd")]
    pub current_period_end: String,
    #[serde(rename = "cancelAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cancel_at: Option<String>,
    #[serde(rename = "canceledAt")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub canceled_at: Option<String>,
    #[serde(rename = "trialStart")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub trial_start: Option<String>,
    #[serde(rename = "trialEnd")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub trial_end: Option<String>,
    #[serde(rename = "startedAt")]
    pub started_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub customer: Option<SubscriptionCustomerResponse>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plan: Option<SubscriptionPlanResponse>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}