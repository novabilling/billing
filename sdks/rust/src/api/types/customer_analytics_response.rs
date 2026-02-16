pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CustomerAnalyticsResponse {
    #[serde(rename = "totalCustomers")]
    pub total_customers: f64,
    #[serde(rename = "newCustomers")]
    pub new_customers: f64,
    /// Average revenue per user
    pub arpu: String,
    #[serde(rename = "totalRevenue")]
    pub total_revenue: String,
}