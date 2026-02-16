pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SubscriptionAnalyticsResponse {
    pub total: f64,
    pub active: f64,
    pub canceled: f64,
    pub trialing: f64,
    pub paused: f64,
    #[serde(rename = "newSubscriptions")]
    pub new_subscriptions: f64,
    /// Churn rate percentage
    #[serde(rename = "churnRate")]
    pub churn_rate: String,
    /// Retention rate percentage
    #[serde(rename = "retentionRate")]
    pub retention_rate: String,
}