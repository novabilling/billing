namespace NovaBilling;

public partial interface ICreditNotesClient
{
    /// <summary>
    /// Retrieve a paginated list of credit notes.
    /// </summary>
    WithRawResponseTask<PaginatedCreditNoteResponse> ListAsync(
        ListCreditNotesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Create a credit note against an invoice. Starts in DRAFT status.
    /// </summary>
    WithRawResponseTask<CreditNoteResponse> CreateAsync(
        CreateCreditNoteDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<CreditNoteResponse> GetAsync(
        GetCreditNotesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    WithRawResponseTask<CreditNoteResponse> CreditNotesControllerUpdateAsync(
        UpdateCreditNoteDto request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Move a credit note from DRAFT to FINALIZED status.
    /// </summary>
    WithRawResponseTask<CreditNoteResponse> FinalizeAsync(
        FinalizeCreditNotesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Cancel a credit note.
    /// </summary>
    WithRawResponseTask<CreditNoteResponse> VoidAsync(
        VoidCreditNotesRequest request,
        RequestOptions? options = null,
        CancellationToken cancellationToken = default
    );
}
