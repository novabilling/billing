pub use crate::prelude::*;

/// Query parameters for getNetRevenue
///
/// Request type for the GetNetRevenueQueryRequest operation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct GetNetRevenueQueryRequest {
    #[serde(rename = "dateFrom")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_from: Option<String>,
    #[serde(rename = "dateTo")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_to: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,
    #[serde(rename = "groupBy")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub group_by: Option<GetNetRevenueAnalyticsRequestGroupBy>,
}
