using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<BillableMetricResponseAggregationType>))]
[Serializable]
public readonly record struct BillableMetricResponseAggregationType : IStringEnum
{
    public static readonly BillableMetricResponseAggregationType Count = new(Values.Count);

    public static readonly BillableMetricResponseAggregationType Sum = new(Values.Sum);

    public static readonly BillableMetricResponseAggregationType Max = new(Values.Max);

    public static readonly BillableMetricResponseAggregationType UniqueCount = new(
        Values.UniqueCount
    );

    public static readonly BillableMetricResponseAggregationType Latest = new(Values.Latest);

    public static readonly BillableMetricResponseAggregationType WeightedSum = new(
        Values.WeightedSum
    );

    public BillableMetricResponseAggregationType(string value)
    {
        Value = value;
    }

    /// <summary>
    /// The string value of the enum.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Create a string enum with the given value.
    /// </summary>
    public static BillableMetricResponseAggregationType FromCustom(string value)
    {
        return new BillableMetricResponseAggregationType(value);
    }

    public bool Equals(string? other)
    {
        return Value.Equals(other);
    }

    /// <summary>
    /// Returns the string value of the enum.
    /// </summary>
    public override string ToString()
    {
        return Value;
    }

    public static bool operator ==(BillableMetricResponseAggregationType value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(BillableMetricResponseAggregationType value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(BillableMetricResponseAggregationType value) =>
        value.Value;

    public static explicit operator BillableMetricResponseAggregationType(string value) =>
        new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Count = "COUNT";

        public const string Sum = "SUM";

        public const string Max = "MAX";

        public const string UniqueCount = "UNIQUE_COUNT";

        public const string Latest = "LATEST";

        public const string WeightedSum = "WEIGHTED_SUM";
    }
}
