import Foundation

public enum CreateBillableMetricDtoAggregationType: String, Codable, Hashable, CaseIterable, Sendable {
    case count = "COUNT"
    case sum = "SUM"
    case max = "MAX"
    case uniqueCount = "UNIQUE_COUNT"
    case latest = "LATEST"
    case weightedSum = "WEIGHTED_SUM"
}