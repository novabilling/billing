pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum SubscriptionResponseStatus {
    #[serde(rename = "ACTIVE")]
    Active,
    #[serde(rename = "PAST_DUE")]
    PastDue,
    #[serde(rename = "CANCELED")]
    Canceled,
    #[serde(rename = "TRIALING")]
    Trialing,
    #[serde(rename = "PAUSED")]
    Paused,
}
impl fmt::Display for SubscriptionResponseStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Active => "ACTIVE",
            Self::PastDue => "PAST_DUE",
            Self::Canceled => "CANCELED",
            Self::Trialing => "TRIALING",
            Self::Paused => "PAUSED",
        };
        write!(f, "{}", s)
    }
}
