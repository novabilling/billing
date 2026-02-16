import Foundation

public final class PaymentMethodsClient: Sendable {
    private let httpClient: HTTPClient

    init(config: ClientConfig) {
        self.httpClient = HTTPClient(config: config)
    }

    public func list(requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payment-methods",
            requestOptions: requestOptions
        )
    }

    public func create(request: Requests.CreatePaymentMethodDto, requestOptions: RequestOptions? = nil) async throws -> PaymentMethodResponse {
        return try await httpClient.performRequest(
            method: .post,
            path: "/api/payment-methods",
            body: request,
            requestOptions: requestOptions,
            responseType: PaymentMethodResponse.self
        )
    }

    public func getByCustomer(customerId: String, requestOptions: RequestOptions? = nil) async throws -> [PaymentMethodResponse] {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payment-methods/customer/\(customerId)",
            requestOptions: requestOptions,
            responseType: [PaymentMethodResponse].self
        )
    }

    public func get(id: String, requestOptions: RequestOptions? = nil) async throws -> PaymentMethodResponse {
        return try await httpClient.performRequest(
            method: .get,
            path: "/api/payment-methods/\(id)",
            requestOptions: requestOptions,
            responseType: PaymentMethodResponse.self
        )
    }

    public func delete(id: String, requestOptions: RequestOptions? = nil) async throws -> Void {
        return try await httpClient.performRequest(
            method: .delete,
            path: "/api/payment-methods/\(id)",
            requestOptions: requestOptions
        )
    }

    public func setDefault(id: String, requestOptions: RequestOptions? = nil) async throws -> PaymentMethodResponse {
        return try await httpClient.performRequest(
            method: .patch,
            path: "/api/payment-methods/\(id)/set-default",
            requestOptions: requestOptions,
            responseType: PaymentMethodResponse.self
        )
    }
}