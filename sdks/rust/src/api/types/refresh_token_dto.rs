pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct RefreshTokenDto {
    /// Refresh token
    #[serde(rename = "refreshToken")]
    pub refresh_token: String,
}
