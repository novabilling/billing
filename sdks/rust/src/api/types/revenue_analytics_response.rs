pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct RevenueAnalyticsResponse {
    /// Total revenue as decimal string
    #[serde(rename = "totalRevenue")]
    pub total_revenue: String,
    #[serde(rename = "invoiceCount")]
    pub invoice_count: f64,
    /// Monthly recurring revenue
    pub mrr: String,
    /// Annual recurring revenue
    pub arr: String,
}