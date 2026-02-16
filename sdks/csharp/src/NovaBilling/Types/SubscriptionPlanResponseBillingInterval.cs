using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<SubscriptionPlanResponseBillingInterval>))]
[Serializable]
public readonly record struct SubscriptionPlanResponseBillingInterval : IStringEnum
{
    public static readonly SubscriptionPlanResponseBillingInterval Hourly = new(Values.Hourly);

    public static readonly SubscriptionPlanResponseBillingInterval Daily = new(Values.Daily);

    public static readonly SubscriptionPlanResponseBillingInterval Weekly = new(Values.Weekly);

    public static readonly SubscriptionPlanResponseBillingInterval Monthly = new(Values.Monthly);

    public static readonly SubscriptionPlanResponseBillingInterval Quarterly = new(
        Values.Quarterly
    );

    public static readonly SubscriptionPlanResponseBillingInterval Yearly = new(Values.Yearly);

    public SubscriptionPlanResponseBillingInterval(string value)
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
    public static SubscriptionPlanResponseBillingInterval FromCustom(string value)
    {
        return new SubscriptionPlanResponseBillingInterval(value);
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

    public static bool operator ==(SubscriptionPlanResponseBillingInterval value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(SubscriptionPlanResponseBillingInterval value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(SubscriptionPlanResponseBillingInterval value) =>
        value.Value;

    public static explicit operator SubscriptionPlanResponseBillingInterval(string value) =>
        new(value);

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
