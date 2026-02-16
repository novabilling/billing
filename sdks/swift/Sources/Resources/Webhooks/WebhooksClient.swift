import Foundation

public final class WebhooksClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Receives payment event notifications from Paystack. The signature is verified using HMAC-SHA512 with the provider's secret key. On success, updates the payment/invoice status and sends customer notifications.
    ///
    /// - Parameter paystackSignature: Paystack HMAC-SHA512 signature
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func webhooksControllerPaystack(paystackSignature: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/webhooks/paystack",
            headers: [
                "x-paystack-signature": paystackSignature
            ],
            requestOptions: requestOptions
        )
    }

    /// Receives payment event notifications from Flutterwave. Verified using the verif-hash header against the configured encryption key.
    ///
    /// - Parameter verifHash: Flutterwave verification hash
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func webhooksControllerFlutterwave(verifHash: String? = nil, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/webhooks/flutterwave",
            headers: [
                "verif-hash": verifHash
            ],
            requestOptions: requestOptions
        )
    }

    /// Receives payment callback notifications from DPO Group (DirectPay Online). Verifies the transaction token status and updates payment accordingly.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func webhooksControllerDpo(requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/webhooks/dpo",
            requestOptions: requestOptions
        )
    }

    /// Receives Instant Payment Notifications (IPN) from PayU South Africa. Updates payment status based on the transaction state.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func webhooksControllerPayu(requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/webhooks/payu",
            requestOptions: requestOptions
        )
    }

    /// Receives IPN (Instant Payment Notification) callbacks from Pesapal. Fetches transaction status using the OrderTrackingId and updates payment.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func webhooksControllerPesapal(requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/webhooks/pesapal",
            requestOptions: requestOptions
        )
    }

    /// Receives event notifications from Stripe (e.g. checkout.session.completed, payment_intent.succeeded). Verified using the stripe-signature header with the configured webhook secret.
    ///
    /// - Parameter stripeSignature: Stripe webhook signature
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func webhooksControllerStripe(stripeSignature: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .post,
            path: "/webhooks/stripe",
            headers: [
                "stripe-signature": stripeSignature
            ],
            requestOptions: requestOptions
        )
    }
}