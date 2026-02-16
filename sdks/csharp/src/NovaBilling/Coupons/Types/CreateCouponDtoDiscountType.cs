using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateCouponDtoDiscountType>))]
[Serializable]
public readonly record struct CreateCouponDtoDiscountType : IStringEnum
{
    public static readonly CreateCouponDtoDiscountType Percentage = new(Values.Percentage);

    public static readonly CreateCouponDtoDiscountType FixedAmount = new(Values.FixedAmount);

    public CreateCouponDtoDiscountType(string value)
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
    public static CreateCouponDtoDiscountType FromCustom(string value)
    {
        return new CreateCouponDtoDiscountType(value);
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

    public static bool operator ==(CreateCouponDtoDiscountType value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateCouponDtoDiscountType value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateCouponDtoDiscountType value) => value.Value;

    public static explicit operator CreateCouponDtoDiscountType(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Percentage = "PERCENTAGE";

        public const string FixedAmount = "FIXED_AMOUNT";
    }
}
