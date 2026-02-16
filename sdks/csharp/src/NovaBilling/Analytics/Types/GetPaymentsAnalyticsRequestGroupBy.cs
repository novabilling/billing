using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetPaymentsAnalyticsRequestGroupBy>))]
[Serializable]
public readonly record struct GetPaymentsAnalyticsRequestGroupBy : IStringEnum
{
    public static readonly GetPaymentsAnalyticsRequestGroupBy Day = new(Values.Day);

    public static readonly GetPaymentsAnalyticsRequestGroupBy Week = new(Values.Week);

    public static readonly GetPaymentsAnalyticsRequestGroupBy Month = new(Values.Month);

    public GetPaymentsAnalyticsRequestGroupBy(string value)
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
    public static GetPaymentsAnalyticsRequestGroupBy FromCustom(string value)
    {
        return new GetPaymentsAnalyticsRequestGroupBy(value);
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

    public static bool operator ==(GetPaymentsAnalyticsRequestGroupBy value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetPaymentsAnalyticsRequestGroupBy value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetPaymentsAnalyticsRequestGroupBy value) => value.Value;

    public static explicit operator GetPaymentsAnalyticsRequestGroupBy(string value) => new(value);

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
