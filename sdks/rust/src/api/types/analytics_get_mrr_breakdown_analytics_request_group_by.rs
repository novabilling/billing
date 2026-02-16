pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum GetMrrBreakdownAnalyticsRequestGroupBy {
    #[serde(rename = "day")]
    Day,
    #[serde(rename = "week")]
    Week,
    #[serde(rename = "month")]
    Month,
}
impl fmt::Display for GetMrrBreakdownAnalyticsRequestGroupBy {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Day => "day",
            Self::Week => "week",
            Self::Month => "month",
        };
        write!(f, "{}", s)
    }
}
