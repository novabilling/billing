using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreatePlanDtoBillingTiming>))]
[Serializable]
public readonly record struct CreatePlanDtoBillingTiming : IStringEnum
{
    public static readonly CreatePlanDtoBillingTiming InAdvance = new(Values.InAdvance);

    public static readonly CreatePlanDtoBillingTiming InArrears = new(Values.InArrears);

    public CreatePlanDtoBillingTiming(string value)
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
    public static CreatePlanDtoBillingTiming FromCustom(string value)
    {
        return new CreatePlanDtoBillingTiming(value);
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

    public static bool operator ==(CreatePlanDtoBillingTiming value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreatePlanDtoBillingTiming value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreatePlanDtoBillingTiming value) => value.Value;

    public static explicit operator CreatePlanDtoBillingTiming(string value) => new(value);

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
