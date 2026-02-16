pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ChurnCohortsResponse {
    pub months: Vec<String>,
    pub cohorts: Vec<CohortRow>,
}