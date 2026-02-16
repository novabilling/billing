using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetMrrBreakdownAnalyticsRequestGroupBy>))]
[Serializable]
public readonly record struct GetMrrBreakdownAnalyticsRequestGroupBy : IStringEnum
{
    public static readonly GetMrrBreakdownAnalyticsRequestGroupBy Day = new(Values.Day);

    public static readonly GetMrrBreakdownAnalyticsRequestGroupBy Week = new(Values.Week);

    public static readonly GetMrrBreakdownAnalyticsRequestGroupBy Month = new(Values.Month);

    public GetMrrBreakdownAnalyticsRequestGroupBy(string value)
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
    public static GetMrrBreakdownAnalyticsRequestGroupBy FromCustom(string value)
    {
        return new GetMrrBreakdownAnalyticsRequestGroupBy(value);
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

    public static bool operator ==(GetMrrBreakdownAnalyticsRequestGroupBy value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetMrrBreakdownAnalyticsRequestGroupBy value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetMrrBreakdownAnalyticsRequestGroupBy value) =>
        value.Value;

    public static explicit operator GetMrrBreakdownAnalyticsRequestGroupBy(string value) =>
        new(value);

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
