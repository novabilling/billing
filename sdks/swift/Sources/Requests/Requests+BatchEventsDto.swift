import Foundation

extension Requests {
    public struct BatchEventsDto: Codable, Hashable, Sendable {
        /// Array of events to ingest (max 100)
        public let events: [CreateEventDto]
        /// Additional properties that are not explicitly defined in the schema
        public let additionalProperties: [String: JSONValue]

        public init(
            events: [CreateEventDto],
            additionalProperties: [String: JSONValue] = .init()
        ) {
            self.events = events
            self.additionalProperties = additionalProperties
        }

        public init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            self.events = try container.decode([CreateEventDto].self, forKey: .events)
            self.additionalProperties = try decoder.decodeAdditionalProperties(using: CodingKeys.self)
        }

        public func encode(to encoder: Encoder) throws -> Void {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try encoder.encodeAdditionalProperties(self.additionalProperties)
            try container.encode(self.events, forKey: .events)
        }

        /// Keys for encoding/decoding struct properties.
        enum CodingKeys: String, CodingKey, CaseIterable {
            case events
        }
    }
}