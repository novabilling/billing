pub use crate::prelude::*;

/// When to charge: IN_ADVANCE or IN_ARREARS
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum UpdatePlanDtoBillingTiming {
    #[serde(rename = "IN_ADVANCE")]
    InAdvance,
    #[serde(rename = "IN_ARREARS")]
    InArrears,
}
impl fmt::Display for UpdatePlanDtoBillingTiming {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::InAdvance => "IN_ADVANCE",
            Self::InArrears => "IN_ARREARS",
        };
        write!(f, "{}", s)
    }
}
