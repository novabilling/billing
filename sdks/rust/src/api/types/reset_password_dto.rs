pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct ResetPasswordDto {
    /// Password reset token
    pub token: String,
    /// New password (min 8 characters)
    #[serde(rename = "newPassword")]
    pub new_password: String,
}
