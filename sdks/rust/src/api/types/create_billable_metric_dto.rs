pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct CreateBillableMetricDto {
    pub name: String,
    /// Unique metric code
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "aggregationType")]
    pub aggregation_type: CreateBillableMetricDtoAggregationType,
    /// Property key to aggregate (required for SUM, MAX, LATEST, WEIGHTED_SUM)
    #[serde(rename = "fieldName")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub field_name: Option<String>,
    /// If true, value carries forward across billing periods
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recurring: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filters: Option<Vec<CreateBillableMetricFilterDto>>,
}
