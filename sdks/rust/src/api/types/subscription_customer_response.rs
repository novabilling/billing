pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct SubscriptionCustomerResponse {
    pub id: String,
    pub name: String,
    pub email: String,
}