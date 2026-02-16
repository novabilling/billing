import Foundation

public final class AuthClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Create a new tenant account with a company name. This provisions an isolated database, generates an API key, and returns JWT tokens.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func register(request: Requests.RegisterDto, requestOptions: RequestOptions? = nil) async throws -> RegisterResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/auth/register",
            body: request,
            requestOptions: requestOptions,
            responseType: RegisterResponse.self
        )
    }

    /// Authenticate with email and password. Returns an access token and refresh token.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func login(request: Requests.LoginDto, requestOptions: RequestOptions? = nil) async throws -> LoginResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/auth/login",
            body: request,
            requestOptions: requestOptions,
            responseType: LoginResponse.self
        )
    }

    /// Exchange a valid refresh token for a new access/refresh token pair.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func refreshToken(request: Requests.RefreshTokenDto, requestOptions: RequestOptions? = nil) async throws -> TokenPairResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/auth/refresh",
            body: request,
            requestOptions: requestOptions,
            responseType: TokenPairResponse.self
        )
    }

    /// Send a password reset email to the specified address. Always returns success to prevent email enumeration.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func forgotPassword(request: Requests.ForgotPasswordDto, requestOptions: RequestOptions? = nil) async throws -> MessageResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/auth/forgot-password",
            body: request,
            requestOptions: requestOptions,
            responseType: MessageResponse.self
        )
    }

    /// Set a new password using the token received via email.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func resetPassword(request: Requests.ResetPasswordDto, requestOptions: RequestOptions? = nil) async throws -> MessageResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/auth/reset-password",
            body: request,
            requestOptions: requestOptions,
            responseType: MessageResponse.self
        )
    }
}