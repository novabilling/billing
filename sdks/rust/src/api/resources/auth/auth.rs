use crate::{ClientConfig, ApiError, HttpClient, RequestOptions};
use reqwest::{Method};
use crate::api::{*};

pub struct AuthClient {
    pub http_client: HttpClient,
}

impl AuthClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Create a new tenant account with a company name. This provisions an isolated database, generates an API key, and returns JWT tokens.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn register(&self, request: &RegisterDto, options: Option<RequestOptions>) -> Result<RegisterResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/auth/register",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Authenticate with email and password. Returns an access token and refresh token.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn login(&self, request: &LoginDto, options: Option<RequestOptions>) -> Result<LoginResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/auth/login",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Exchange a valid refresh token for a new access/refresh token pair.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn refresh_token(&self, request: &RefreshTokenDto, options: Option<RequestOptions>) -> Result<TokenPairResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/auth/refresh",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Send a password reset email to the specified address. Always returns success to prevent email enumeration.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn forgot_password(&self, request: &ForgotPasswordDto, options: Option<RequestOptions>) -> Result<MessageResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/auth/forgot-password",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Set a new password using the token received via email.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn reset_password(&self, request: &ResetPasswordDto, options: Option<RequestOptions>) -> Result<MessageResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/auth/reset-password",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

}

