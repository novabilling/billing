pub use crate::prelude::*;

/// When to cancel: immediately or at end of current period
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CancelSubscriptionDtoCancelAt {
    #[serde(rename = "now")]
    Now,
    #[serde(rename = "period_end")]
    PeriodEnd,
}
impl fmt::Display for CancelSubscriptionDtoCancelAt {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Now => "now",
            Self::PeriodEnd => "period_end",
        };
        write!(f, "{}", s)
    }
}
