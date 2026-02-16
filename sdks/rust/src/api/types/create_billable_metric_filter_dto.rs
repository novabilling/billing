pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct CreateBillableMetricFilterDto {
    /// Property key to filter on
    pub key: String,
    /// Allowed values
    pub values: Vec<String>,
}