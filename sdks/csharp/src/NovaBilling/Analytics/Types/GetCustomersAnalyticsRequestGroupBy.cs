using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetCustomersAnalyticsRequestGroupBy>))]
[Serializable]
public readonly record struct GetCustomersAnalyticsRequestGroupBy : IStringEnum
{
    public static readonly GetCustomersAnalyticsRequestGroupBy Day = new(Values.Day);

    public static readonly GetCustomersAnalyticsRequestGroupBy Week = new(Values.Week);

    public static readonly GetCustomersAnalyticsRequestGroupBy Month = new(Values.Month);

    public GetCustomersAnalyticsRequestGroupBy(string value)
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
    public static GetCustomersAnalyticsRequestGroupBy FromCustom(string value)
    {
        return new GetCustomersAnalyticsRequestGroupBy(value);
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

    public static bool operator ==(GetCustomersAnalyticsRequestGroupBy value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetCustomersAnalyticsRequestGroupBy value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetCustomersAnalyticsRequestGroupBy value) =>
        value.Value;

    public static explicit operator GetCustomersAnalyticsRequestGroupBy(string value) => new(value);

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
