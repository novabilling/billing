using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<UpdatePlanDtoBillingInterval>))]
[Serializable]
public readonly record struct UpdatePlanDtoBillingInterval : IStringEnum
{
    public static readonly UpdatePlanDtoBillingInterval Hourly = new(Values.Hourly);

    public static readonly UpdatePlanDtoBillingInterval Daily = new(Values.Daily);

    public static readonly UpdatePlanDtoBillingInterval Weekly = new(Values.Weekly);

    public static readonly UpdatePlanDtoBillingInterval Monthly = new(Values.Monthly);

    public static readonly UpdatePlanDtoBillingInterval Quarterly = new(Values.Quarterly);

    public static readonly UpdatePlanDtoBillingInterval Yearly = new(Values.Yearly);

    public UpdatePlanDtoBillingInterval(string value)
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
    public static UpdatePlanDtoBillingInterval FromCustom(string value)
    {
        return new UpdatePlanDtoBillingInterval(value);
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

    public static bool operator ==(UpdatePlanDtoBillingInterval value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(UpdatePlanDtoBillingInterval value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(UpdatePlanDtoBillingInterval value) => value.Value;

    public static explicit operator UpdatePlanDtoBillingInterval(string value) => new(value);

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
