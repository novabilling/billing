using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateCreditNoteDtoReason>))]
[Serializable]
public readonly record struct CreateCreditNoteDtoReason : IStringEnum
{
    public static readonly CreateCreditNoteDtoReason Duplicate = new(Values.Duplicate);

    public static readonly CreateCreditNoteDtoReason ProductUnsatisfactory = new(
        Values.ProductUnsatisfactory
    );

    public static readonly CreateCreditNoteDtoReason OrderChange = new(Values.OrderChange);

    public static readonly CreateCreditNoteDtoReason Other = new(Values.Other);

    public CreateCreditNoteDtoReason(string value)
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
    public static CreateCreditNoteDtoReason FromCustom(string value)
    {
        return new CreateCreditNoteDtoReason(value);
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

    public static bool operator ==(CreateCreditNoteDtoReason value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateCreditNoteDtoReason value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateCreditNoteDtoReason value) => value.Value;

    public static explicit operator CreateCreditNoteDtoReason(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Duplicate = "DUPLICATE";

        public const string ProductUnsatisfactory = "PRODUCT_UNSATISFACTORY";

        public const string OrderChange = "ORDER_CHANGE";

        public const string Other = "OTHER";
    }
}
