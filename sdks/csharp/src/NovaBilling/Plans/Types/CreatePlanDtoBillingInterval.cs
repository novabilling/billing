using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreatePlanDtoBillingInterval>))]
[Serializable]
public readonly record struct CreatePlanDtoBillingInterval : IStringEnum
{
    public static readonly CreatePlanDtoBillingInterval Hourly = new(Values.Hourly);

    public static readonly CreatePlanDtoBillingInterval Daily = new(Values.Daily);

    public static readonly CreatePlanDtoBillingInterval Weekly = new(Values.Weekly);

    public static readonly CreatePlanDtoBillingInterval Monthly = new(Values.Monthly);

    public static readonly CreatePlanDtoBillingInterval Quarterly = new(Values.Quarterly);

    public static readonly CreatePlanDtoBillingInterval Yearly = new(Values.Yearly);

    public CreatePlanDtoBillingInterval(string value)
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
    public static CreatePlanDtoBillingInterval FromCustom(string value)
    {
        return new CreatePlanDtoBillingInterval(value);
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

    public static bool operator ==(CreatePlanDtoBillingInterval value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreatePlanDtoBillingInterval value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreatePlanDtoBillingInterval value) => value.Value;

    public static explicit operator CreatePlanDtoBillingInterval(string value) => new(value);

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
