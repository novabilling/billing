using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreatePaymentDtoStatus>))]
[Serializable]
public readonly record struct CreatePaymentDtoStatus : IStringEnum
{
    public static readonly CreatePaymentDtoStatus Processing = new(Values.Processing);

    public static readonly CreatePaymentDtoStatus Succeeded = new(Values.Succeeded);

    public static readonly CreatePaymentDtoStatus Failed = new(Values.Failed);

    public static readonly CreatePaymentDtoStatus Refunded = new(Values.Refunded);

    public CreatePaymentDtoStatus(string value)
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
    public static CreatePaymentDtoStatus FromCustom(string value)
    {
        return new CreatePaymentDtoStatus(value);
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

    public static bool operator ==(CreatePaymentDtoStatus value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreatePaymentDtoStatus value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreatePaymentDtoStatus value) => value.Value;

    public static explicit operator CreatePaymentDtoStatus(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Processing = "PROCESSING";

        public const string Succeeded = "SUCCEEDED";

        public const string Failed = "FAILED";

        public const string Refunded = "REFUNDED";
    }
}
