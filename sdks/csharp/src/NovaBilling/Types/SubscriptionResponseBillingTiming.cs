using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<SubscriptionResponseBillingTiming>))]
[Serializable]
public readonly record struct SubscriptionResponseBillingTiming : IStringEnum
{
    public static readonly SubscriptionResponseBillingTiming InAdvance = new(Values.InAdvance);

    public static readonly SubscriptionResponseBillingTiming InArrears = new(Values.InArrears);

    public SubscriptionResponseBillingTiming(string value)
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
    public static SubscriptionResponseBillingTiming FromCustom(string value)
    {
        return new SubscriptionResponseBillingTiming(value);
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

    public static bool operator ==(SubscriptionResponseBillingTiming value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(SubscriptionResponseBillingTiming value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(SubscriptionResponseBillingTiming value) => value.Value;

    public static explicit operator SubscriptionResponseBillingTiming(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string InAdvance = "IN_ADVANCE";

        public const string InArrears = "IN_ARREARS";
    }
}
