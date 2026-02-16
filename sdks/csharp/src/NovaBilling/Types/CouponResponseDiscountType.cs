using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CouponResponseDiscountType>))]
[Serializable]
public readonly record struct CouponResponseDiscountType : IStringEnum
{
    public static readonly CouponResponseDiscountType Percentage = new(Values.Percentage);

    public static readonly CouponResponseDiscountType FixedAmount = new(Values.FixedAmount);

    public CouponResponseDiscountType(string value)
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
    public static CouponResponseDiscountType FromCustom(string value)
    {
        return new CouponResponseDiscountType(value);
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

    public static bool operator ==(CouponResponseDiscountType value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CouponResponseDiscountType value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CouponResponseDiscountType value) => value.Value;

    public static explicit operator CouponResponseDiscountType(string value) => new(value);

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
