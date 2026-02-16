import Foundation

public struct ChurnCohortsResponse: Codable, Hashable, Sendable {
    public let months: [String]
    public let cohorts: [CohortRow]
    /// Additional properties that are not explicitly defined in the schema
    public let additionalProperties: [String: JSONValue]

    public init(
        months: [String],
        cohorts: [CohortRow],
        additionalProperties: [String: JSONValue] = .init()
    ) {
        self.months = months
        self.cohorts = cohorts
        self.additionalProperties = additionalProperties
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.months = try container.decode([String].self, forKey: .months)
        self.cohorts = try container.decode([CohortRow].self, forKey: .cohorts)
        self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
    }

    public func encode(to encoder: Encoder) throws -> Void {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try encoder.encodeAdditionalProperties(self.additionalProperties)
        try container.encode(self.months, forKey: .months)
        try container.encode(self.cohorts, forKey: .cohorts)
    }

    /// Keys for encoding/decoding struct properties.
    enum CodingKeys: String, CodingKey, CaseIterable {
        case months
        case cohorts
    }
}