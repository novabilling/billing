using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<GetSubscriptionsAnalyticsRequestGroupBy>))]
[Serializable]
public readonly record struct GetSubscriptionsAnalyticsRequestGroupBy : IStringEnum
{
    public static readonly GetSubscriptionsAnalyticsRequestGroupBy Day = new(Values.Day);

    public static readonly GetSubscriptionsAnalyticsRequestGroupBy Week = new(Values.Week);

    public static readonly GetSubscriptionsAnalyticsRequestGroupBy Month = new(Values.Month);

    public GetSubscriptionsAnalyticsRequestGroupBy(string value)
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
    public static GetSubscriptionsAnalyticsRequestGroupBy FromCustom(string value)
    {
        return new GetSubscriptionsAnalyticsRequestGroupBy(value);
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

    public static bool operator ==(GetSubscriptionsAnalyticsRequestGroupBy value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(GetSubscriptionsAnalyticsRequestGroupBy value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(GetSubscriptionsAnalyticsRequestGroupBy value) =>
        value.Value;

    public static explicit operator GetSubscriptionsAnalyticsRequestGroupBy(string value) =>
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
