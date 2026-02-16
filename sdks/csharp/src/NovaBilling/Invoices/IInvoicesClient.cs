namespace NovaBilling;

public partial interface IInvoicesClient
{
    /// <summary>
    /// Retrieve a paginated list of invoices. Supports filtering by status, customer, and date range.
    /// </summary>
    WithRawResponseTask<PaginatedInvoiceResponse> ListAsync(
        ListInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a draft invoice with line items. The total amount is automatically calculated from the items.
    /// </summary>
    WithRawResponseTask<InvoiceResponse> CreateAsync(
        CreateInvoiceDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieve detailed invoice information including associated customer, subscription, and payments.
    /// </summary>
    WithRawResponseTask<InvoiceResponse> GetAsync(
        GetInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Move an invoice from draft to pending status, making it ready for payment.
    /// </summary>
    WithRawResponseTask<InvoiceResponse> FinalizeAsync(
        FinalizeInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Cancel an unpaid invoice. Paid invoices cannot be voided — use a refund instead.
    /// </summary>
    WithRawResponseTask<InvoiceResponse> VoidAsync(
        VoidInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Record an offline or manual payment against an invoice. Accepts an optional paymentMethod (e.g. "cash", "bank_transfer", "check", "manual").
    /// </summary>
    WithRawResponseTask<InvoiceResponse> MarkPaidAsync(
        MarkPaidInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Initiate a payment session with the configured payment provider (Stripe, Paystack, Flutterwave, or M-Pesa). Returns a checkout URL that redirects the customer to the provider's hosted payment page.
    /// </summary>
    WithRawResponseTask<CheckoutResponse> CreateCheckoutAsync(
        CreateCheckoutInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Send the invoice to a specified email address, or to the customer's email if none is provided.
    /// </summary>
    WithRawResponseTask<MessageResponse> SendEmailAsync(
        SendEmailInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Returns the PDF binary for the invoice. If a PDF has not been generated yet, it will be created on-demand.
    /// </summary>
    Task GetPdfAsync(
        GetPdfInvoicesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
