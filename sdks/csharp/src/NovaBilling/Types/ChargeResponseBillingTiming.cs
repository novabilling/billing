using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<ChargeResponseBillingTiming>))]
[Serializable]
public readonly record struct ChargeResponseBillingTiming : IStringEnum
{
    public static readonly ChargeResponseBillingTiming InAdvance = new(Values.InAdvance);

    public static readonly ChargeResponseBillingTiming InArrears = new(Values.InArrears);

    public ChargeResponseBillingTiming(string value)
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
    public static ChargeResponseBillingTiming FromCustom(string value)
    {
        return new ChargeResponseBillingTiming(value);
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

    public static bool operator ==(ChargeResponseBillingTiming value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(ChargeResponseBillingTiming value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(ChargeResponseBillingTiming value) => value.Value;

    public static explicit operator ChargeResponseBillingTiming(string value) => new(value);

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
