pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct BillableMetricFilterResponse {
    pub id: String,
    #[serde(rename = "billableMetricId")]
    pub billable_metric_id: String,
    pub key: String,
    pub values: Vec<String>,
}