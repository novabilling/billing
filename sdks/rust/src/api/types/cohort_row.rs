pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CohortRow {
    pub month: String,
    #[serde(rename = "totalCustomers")]
    pub total_customers: f64,
    #[serde(rename = "retentionPercentages")]
    pub retention_percentages: Vec<f64>,
}