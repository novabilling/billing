pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct BillableMetricResponse {
    pub id: String,
    pub name: String,
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "aggregationType")]
    pub aggregation_type: BillableMetricResponseAggregationType,
    #[serde(rename = "fieldName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub field_name: Option<String>,
    pub recurring: bool,
    pub filters: Vec<BillableMetricFilterResponse>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}