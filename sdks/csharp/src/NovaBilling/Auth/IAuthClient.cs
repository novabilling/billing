namespace NovaBilling;

public partial interface IAuthClient
{
    /// <summary>
    /// Create a new tenant account with a company name. This provisions an isolated database, generates an API key, and returns JWT tokens.
    /// </summary>
    WithRawResponseTask<RegisterResponse> RegisterAsync(
        RegisterDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Authenticate with email and password. Returns an access token and refresh token.
    /// </summary>
    WithRawResponseTask<LoginResponse> LoginAsync(
        LoginDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Exchange a valid refresh token for a new access/refresh token pair.
    /// </summary>
    WithRawResponseTask<TokenPairResponse> RefreshTokenAsync(
        RefreshTokenDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Send a password reset email to the specified address. Always returns success to prevent email enumeration.
    /// </summary>
    WithRawResponseTask<MessageResponse> ForgotPasswordAsync(
        ForgotPasswordDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Set a new password using the token received via email.
    /// </summary>
    WithRawResponseTask<MessageResponse> ResetPasswordAsync(
        ResetPasswordDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
