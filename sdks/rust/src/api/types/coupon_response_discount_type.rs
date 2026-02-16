pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum CouponResponseDiscountType {
    #[serde(rename = "PERCENTAGE")]
    Percentage,
    #[serde(rename = "FIXED_AMOUNT")]
    FixedAmount,
}
impl fmt::Display for CouponResponseDiscountType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Self::Percentage => "PERCENTAGE",
            Self::FixedAmount => "FIXED_AMOUNT",
        };
        write!(f, "{}", s)
    }
}
