using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<PaymentResponseStatus>))]
[Serializable]
public readonly record struct PaymentResponseStatus : IStringEnum
{
    public static readonly PaymentResponseStatus Pending = new(Values.Pending);

    public static readonly PaymentResponseStatus Processing = new(Values.Processing);

    public static readonly PaymentResponseStatus Succeeded = new(Values.Succeeded);

    public static readonly PaymentResponseStatus Failed = new(Values.Failed);

    public static readonly PaymentResponseStatus Refunded = new(Values.Refunded);

    public PaymentResponseStatus(string value)
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
    public static PaymentResponseStatus FromCustom(string value)
    {
        return new PaymentResponseStatus(value);
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

    public static bool operator ==(PaymentResponseStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(PaymentResponseStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(PaymentResponseStatus value) => value.Value;

    public static explicit operator PaymentResponseStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Pending = "PENDING";

        public const string Processing = "PROCESSING";

        public const string Succeeded = "SUCCEEDED";

        public const string Failed = "FAILED";

        public const string Refunded = "REFUNDED";
    }
}
