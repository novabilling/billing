pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PaginationMeta {
    pub total: f64,
    pub page: f64,
    pub limit: f64,
    #[serde(rename = "totalPages")]
    pub total_pages: f64,
}