pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct RegisterDto {
    /// Full name of the tenant owner
    pub name: String,
    /// Email address
    pub email: String,
    /// Password (min 8 characters)
    pub password: String,
    /// Company name (used to generate slug)
    #[serde(rename = "companyName")]
    pub company_name: String,
}
