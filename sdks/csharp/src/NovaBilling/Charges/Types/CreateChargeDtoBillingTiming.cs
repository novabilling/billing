using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateChargeDtoBillingTiming>))]
[Serializable]
public readonly record struct CreateChargeDtoBillingTiming : IStringEnum
{
    public static readonly CreateChargeDtoBillingTiming InAdvance = new(Values.InAdvance);

    public static readonly CreateChargeDtoBillingTiming InArrears = new(Values.InArrears);

    public CreateChargeDtoBillingTiming(string value)
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
    public static CreateChargeDtoBillingTiming FromCustom(string value)
    {
        return new CreateChargeDtoBillingTiming(value);
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

    public static bool operator ==(CreateChargeDtoBillingTiming value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateChargeDtoBillingTiming value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateChargeDtoBillingTiming value) => value.Value;

    public static explicit operator CreateChargeDtoBillingTiming(string value) => new(value);

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
