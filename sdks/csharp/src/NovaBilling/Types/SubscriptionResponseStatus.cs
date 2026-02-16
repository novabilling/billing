using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<SubscriptionResponseStatus>))]
[Serializable]
public readonly record struct SubscriptionResponseStatus : IStringEnum
{
    public static readonly SubscriptionResponseStatus Active = new(Values.Active);

    public static readonly SubscriptionResponseStatus PastDue = new(Values.PastDue);

    public static readonly SubscriptionResponseStatus Canceled = new(Values.Canceled);

    public static readonly SubscriptionResponseStatus Trialing = new(Values.Trialing);

    public static readonly SubscriptionResponseStatus Paused = new(Values.Paused);

    public SubscriptionResponseStatus(string value)
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
    public static SubscriptionResponseStatus FromCustom(string value)
    {
        return new SubscriptionResponseStatus(value);
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

    public static bool operator ==(SubscriptionResponseStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(SubscriptionResponseStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(SubscriptionResponseStatus value) => value.Value;

    public static explicit operator SubscriptionResponseStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Active = "ACTIVE";

        public const string PastDue = "PAST_DUE";

        public const string Canceled = "CANCELED";

        public const string Trialing = "TRIALING";

        public const string Paused = "PAUSED";
    }
}
