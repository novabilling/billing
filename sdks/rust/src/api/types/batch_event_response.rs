pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BatchEventResponse {
    pub received: f64,
    pub processed: f64,
    pub duplicates: f64,
}