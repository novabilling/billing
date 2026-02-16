pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum BillableMetricResponseAggregationType {
    #[serde(rename = "COUNT")]
    Count,
    #[serde(rename = "SUM")]
    Sum,
    #[serde(rename = "MAX")]
    Max,
    #[serde(rename = "UNIQUE_COUNT")]
    UniqueCount,
    #[serde(rename = "LATEST")]
    Latest,
    #[serde(rename = "WEIGHTED_SUM")]
    WeightedSum,
}
impl fmt::Display for BillableMetricResponseAggregationType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Count => "COUNT",
            Self::Sum => "SUM",
            Self::Max => "MAX",
            Self::UniqueCount => "UNIQUE_COUNT",
            Self::Latest => "LATEST",
            Self::WeightedSum => "WEIGHTED_SUM",
        };
        write!(f, "{}", s)
    }
}
