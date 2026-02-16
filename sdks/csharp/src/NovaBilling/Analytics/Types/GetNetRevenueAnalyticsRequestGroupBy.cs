using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetNetRevenueAnalyticsRequestGroupBy>))]
[Serializable]
public readonly record struct GetNetRevenueAnalyticsRequestGroupBy : IStringEnum
{
    public static readonly GetNetRevenueAnalyticsRequestGroupBy Day = new(Values.Day);

    public static readonly GetNetRevenueAnalyticsRequestGroupBy Week = new(Values.Week);

    public static readonly GetNetRevenueAnalyticsRequestGroupBy Month = new(Values.Month);

    public GetNetRevenueAnalyticsRequestGroupBy(string value)
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
    public static GetNetRevenueAnalyticsRequestGroupBy FromCustom(string value)
    {
        return new GetNetRevenueAnalyticsRequestGroupBy(value);
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

    public static bool operator ==(GetNetRevenueAnalyticsRequestGroupBy value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetNetRevenueAnalyticsRequestGroupBy value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetNetRevenueAnalyticsRequestGroupBy value) =>
        value.Value;

    public static explicit operator GetNetRevenueAnalyticsRequestGroupBy(string value) =>
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
