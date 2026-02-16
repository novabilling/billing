using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateSubscriptionDtoStatus>))]
[Serializable]
public readonly record struct CreateSubscriptionDtoStatus : IStringEnum
{
    public static readonly CreateSubscriptionDtoStatus Active = new(Values.Active);

    public static readonly CreateSubscriptionDtoStatus Trialing = new(Values.Trialing);

    public static readonly CreateSubscriptionDtoStatus Paused = new(Values.Paused);

    public static readonly CreateSubscriptionDtoStatus PastDue = new(Values.PastDue);

    public static readonly CreateSubscriptionDtoStatus Canceled = new(Values.Canceled);

    public CreateSubscriptionDtoStatus(string value)
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
    public static CreateSubscriptionDtoStatus FromCustom(string value)
    {
        return new CreateSubscriptionDtoStatus(value);
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

    public static bool operator ==(CreateSubscriptionDtoStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateSubscriptionDtoStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateSubscriptionDtoStatus value) => value.Value;

    public static explicit operator CreateSubscriptionDtoStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Active = "ACTIVE";

        public const string Trialing = "TRIALING";

        public const string Paused = "PAUSED";

        public const string PastDue = "PAST_DUE";

        public const string Canceled = "CANCELED";
    }
}
