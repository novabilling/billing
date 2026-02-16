namespace NovaBilling;

public partial interface IWebhooksClient
{
    /// <summary>
    /// Receives payment event notifications from Paystack. The signature is verified using HMAC-SHA512 with the provider's secret key. On success, updates the payment/invoice status and sends customer notifications.
    /// </summary>
    Task WebhooksControllerPaystackAsync(
        WebhooksControllerPaystackRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Receives payment event notifications from Flutterwave. Verified using the verif-hash header against the configured encryption key.
    /// </summary>
    Task WebhooksControllerFlutterwaveAsync(
        WebhooksControllerFlutterwaveRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Receives payment callback notifications from DPO Group (DirectPay Online). Verifies the transaction token status and updates payment accordingly.
    /// </summary>
    Task WebhooksControllerDpoAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Receives Instant Payment Notifications (IPN) from PayU South Africa. Updates payment status based on the transaction state.
    /// </summary>
    Task WebhooksControllerPayuAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Receives IPN (Instant Payment Notification) callbacks from Pesapal. Fetches transaction status using the OrderTrackingId and updates payment.
    /// </summary>
    Task WebhooksControllerPesapalAsync(
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Receives event notifications from Stripe (e.g. checkout.session.completed, payment_intent.succeeded). Verified using the stripe-signature header with the configured webhook secret.
    /// </summary>
    Task WebhooksControllerStripeAsync(
        WebhooksControllerStripeRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
