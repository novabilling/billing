pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CreateChargeDtoChargeModel {
    #[serde(rename = "STANDARD")]
    Standard,
    #[serde(rename = "GRADUATED")]
    Graduated,
    #[serde(rename = "VOLUME")]
    Volume,
    #[serde(rename = "PACKAGE")]
    Package,
    #[serde(rename = "PERCENTAGE")]
    Percentage,
}
impl fmt::Display for CreateChargeDtoChargeModel {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Standard => "STANDARD",
            Self::Graduated => "GRADUATED",
            Self::Volume => "VOLUME",
            Self::Package => "PACKAGE",
            Self::Percentage => "PERCENTAGE",
        };
        write!(f, "{}", s)
    }
}
