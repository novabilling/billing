using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateBillableMetricDtoAggregationType>))]
[Serializable]
public readonly record struct CreateBillableMetricDtoAggregationType : IStringEnum
{
    public static readonly CreateBillableMetricDtoAggregationType Count = new(Values.Count);

    public static readonly CreateBillableMetricDtoAggregationType Sum = new(Values.Sum);

    public static readonly CreateBillableMetricDtoAggregationType Max = new(Values.Max);

    public static readonly CreateBillableMetricDtoAggregationType UniqueCount = new(
        Values.UniqueCount
    );

    public static readonly CreateBillableMetricDtoAggregationType Latest = new(Values.Latest);

    public static readonly CreateBillableMetricDtoAggregationType WeightedSum = new(
        Values.WeightedSum
    );

    public CreateBillableMetricDtoAggregationType(string value)
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
    public static CreateBillableMetricDtoAggregationType FromCustom(string value)
    {
        return new CreateBillableMetricDtoAggregationType(value);
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

    public static bool operator ==(CreateBillableMetricDtoAggregationType value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateBillableMetricDtoAggregationType value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateBillableMetricDtoAggregationType value) =>
        value.Value;

    public static explicit operator CreateBillableMetricDtoAggregationType(string value) =>
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
