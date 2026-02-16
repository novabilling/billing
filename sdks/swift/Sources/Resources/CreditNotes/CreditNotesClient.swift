import Foundation

public final class CreditNotesClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    /// Retrieve a paginated list of credit notes.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func list(customerId: String? = nil, invoiceId: String? = nil, status: ListCreditNotesRequestStatus? = nil, page: Double? = nil, limit: Double? = nil, requestOptions: RequestOptions? = nil) async throws -> PaginatedCreditNoteResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/credit-notes",
            queryParams: [
                "customerId": customerId.map { .string($0) }, 
                "invoiceId": invoiceId.map { .string($0) }, 
                "status": status.map { .string($0.rawValue) }, 
                "page": page.map { .double($0) }, 
                "limit": limit.map { .double($0) }
            ],
            requestOptions: requestOptions,
            responseType: PaginatedCreditNoteResponse.self
        )
    }

    /// Create a credit note against an invoice. Starts in DRAFT status.
    ///
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func create(request: Requests.CreateCreditNoteDto, requestOptions: RequestOptions? = nil) async throws -> CreditNoteResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/credit-notes",
            body: request,
            requestOptions: requestOptions,
            responseType: CreditNoteResponse.self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> CreditNoteResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/credit-notes/\(id)",
            requestOptions: requestOptions,
            responseType: CreditNoteResponse.self
        )
    }

    public func creditNotesControllerUpdate(id: String, request: Requests.UpdateCreditNoteDto, requestOptions: RequestOptions? = nil) async throws -> CreditNoteResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/credit-notes/\(id)",
            body: request,
            requestOptions: requestOptions,
            responseType: CreditNoteResponse.self
        )
    }

    /// Move a credit note from DRAFT to FINALIZED status.
    ///
    /// - Parameter id: Credit note ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func finalize(id: String, requestOptions: RequestOptions? = nil) async throws -> CreditNoteResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/credit-notes/\(id)/finalize",
            requestOptions: requestOptions,
            responseType: CreditNoteResponse.self
        )
    }

    /// Cancel a credit note.
    ///
    /// - Parameter id: Credit note ID
    /// - Parameter requestOptions: Additional options for configuring the request, such as custom headers or timeout settings.
    public func void(id: String, requestOptions: RequestOptions? = nil) async throws -> CreditNoteResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/credit-notes/\(id)/void",
            requestOptions: requestOptions,
            responseType: CreditNoteResponse.self
        )
    }
}