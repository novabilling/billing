using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CancelSubscriptionDtoCancelAt>))]
[Serializable]
public readonly record struct CancelSubscriptionDtoCancelAt : IStringEnum
{
    public static readonly CancelSubscriptionDtoCancelAt Now = new(Values.Now);

    public static readonly CancelSubscriptionDtoCancelAt PeriodEnd = new(Values.PeriodEnd);

    public CancelSubscriptionDtoCancelAt(string value)
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
    public static CancelSubscriptionDtoCancelAt FromCustom(string value)
    {
        return new CancelSubscriptionDtoCancelAt(value);
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

    public static bool operator ==(CancelSubscriptionDtoCancelAt value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CancelSubscriptionDtoCancelAt value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CancelSubscriptionDtoCancelAt value) => value.Value;

    public static explicit operator CancelSubscriptionDtoCancelAt(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Now = "now";

        public const string PeriodEnd = "period_end";
    }
}
