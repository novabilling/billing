using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<PlanResponseBillingInterval>))]
[Serializable]
public readonly record struct PlanResponseBillingInterval : IStringEnum
{
    public static readonly PlanResponseBillingInterval Hourly = new(Values.Hourly);

    public static readonly PlanResponseBillingInterval Daily = new(Values.Daily);

    public static readonly PlanResponseBillingInterval Weekly = new(Values.Weekly);

    public static readonly PlanResponseBillingInterval Monthly = new(Values.Monthly);

    public static readonly PlanResponseBillingInterval Quarterly = new(Values.Quarterly);

    public static readonly PlanResponseBillingInterval Yearly = new(Values.Yearly);

    public PlanResponseBillingInterval(string value)
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
    public static PlanResponseBillingInterval FromCustom(string value)
    {
        return new PlanResponseBillingInterval(value);
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

    public static bool operator ==(PlanResponseBillingInterval value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(PlanResponseBillingInterval value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(PlanResponseBillingInterval value) => value.Value;

    public static explicit operator PlanResponseBillingInterval(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Hourly = "HOURLY";

        public const string Daily = "DAILY";

        public const string Weekly = "WEEKLY";

        public const string Monthly = "MONTHLY";

        public const string Quarterly = "QUARTERLY";

        public const string Yearly = "YEARLY";
    }
}
