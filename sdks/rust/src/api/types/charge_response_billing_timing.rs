pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum ChargeResponseBillingTiming {
    #[serde(rename = "IN_ADVANCE")]
    InAdvance,
    #[serde(rename = "IN_ARREARS")]
    InArrears,
}
impl fmt::Display for ChargeResponseBillingTiming {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::InAdvance => "IN_ADVANCE",
            Self::InArrears => "IN_ARREARS",
        };
        write!(f, "{}", s)
    }
}
