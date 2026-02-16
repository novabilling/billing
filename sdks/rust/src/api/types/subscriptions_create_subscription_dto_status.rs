pub use crate::prelude::*;

/// Override subscription status for imports
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreateSubscriptionDtoStatus {
    #[serde(rename = "ACTIVE")]
    Active,
    #[serde(rename = "TRIALING")]
    Trialing,
    #[serde(rename = "PAUSED")]
    Paused,
    #[serde(rename = "PAST_DUE")]
    PastDue,
    #[serde(rename = "CANCELED")]
    Canceled,
}
impl fmt::Display for CreateSubscriptionDtoStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Active => "ACTIVE",
            Self::Trialing => "TRIALING",
            Self::Paused => "PAUSED",
            Self::PastDue => "PAST_DUE",
            Self::Canceled => "CANCELED",
        };
        write!(f, "{}", s)
    }
}
