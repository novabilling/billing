using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetRevenueAnalyticsRequestGroupBy>))]
[Serializable]
public readonly record struct GetRevenueAnalyticsRequestGroupBy : IStringEnum
{
    public static readonly GetRevenueAnalyticsRequestGroupBy Day = new(Values.Day);

    public static readonly GetRevenueAnalyticsRequestGroupBy Week = new(Values.Week);

    public static readonly GetRevenueAnalyticsRequestGroupBy Month = new(Values.Month);

    public GetRevenueAnalyticsRequestGroupBy(string value)
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
    public static GetRevenueAnalyticsRequestGroupBy FromCustom(string value)
    {
        return new GetRevenueAnalyticsRequestGroupBy(value);
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

    public static bool operator ==(GetRevenueAnalyticsRequestGroupBy value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetRevenueAnalyticsRequestGroupBy value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetRevenueAnalyticsRequestGroupBy value) => value.Value;

    public static explicit operator GetRevenueAnalyticsRequestGroupBy(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Day = "day";

        public const string Week = "week";

        public const string Month = "month";
    }
}
