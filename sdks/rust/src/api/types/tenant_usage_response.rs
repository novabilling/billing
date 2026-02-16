pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TenantUsageResponse {
    pub customers: f64,
    #[serde(rename = "activeSubscriptions")]
    pub active_subscriptions: f64,
    #[serde(rename = "totalInvoices")]
    pub total_invoices: f64,
    #[serde(rename = "totalRevenue")]
    pub total_revenue: String,
}