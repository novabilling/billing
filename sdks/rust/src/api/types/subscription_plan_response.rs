pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct SubscriptionPlanResponse {
    pub id: String,
    pub name: String,
    #[serde(rename = "billingInterval")]
    pub billing_interval: SubscriptionPlanResponseBillingInterval,
}