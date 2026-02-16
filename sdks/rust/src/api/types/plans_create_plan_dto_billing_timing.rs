pub use crate::prelude::*;

/// When to charge: IN_ADVANCE (at period start) or IN_ARREARS (at period end). Defaults to IN_ARREARS.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreatePlanDtoBillingTiming {
    #[serde(rename = "IN_ADVANCE")]
    InAdvance,
    #[serde(rename = "IN_ARREARS")]
    InArrears,
}
impl fmt::Display for CreatePlanDtoBillingTiming {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::InAdvance => "IN_ADVANCE",
            Self::InArrears => "IN_ARREARS",
        };
        write!(f, "{}", s)
    }
}
