pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct NetRevenueResponse {
    #[serde(rename = "grossRevenue")]
    pub gross_revenue: f64,
    pub refunds: f64,
    #[serde(rename = "creditNotes")]
    pub credit_notes: f64,
    #[serde(rename = "netRevenue")]
    pub net_revenue: f64,
}