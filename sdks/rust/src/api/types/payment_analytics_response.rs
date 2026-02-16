pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaymentAnalyticsResponse {
    #[serde(rename = "totalPayments")]
    pub total_payments: f64,
    pub succeeded: f64,
    pub failed: f64,
    pub pending: f64,
    /// Success rate percentage
    #[serde(rename = "successRate")]
    pub success_rate: String,
}