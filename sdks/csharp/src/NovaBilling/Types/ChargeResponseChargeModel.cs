using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<ChargeResponseChargeModel>))]
[Serializable]
public readonly record struct ChargeResponseChargeModel : IStringEnum
{
    public static readonly ChargeResponseChargeModel Standard = new(Values.Standard);

    public static readonly ChargeResponseChargeModel Graduated = new(Values.Graduated);

    public static readonly ChargeResponseChargeModel Volume = new(Values.Volume);

    public static readonly ChargeResponseChargeModel Package = new(Values.Package);

    public static readonly ChargeResponseChargeModel Percentage = new(Values.Percentage);

    public ChargeResponseChargeModel(string value)
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
    public static ChargeResponseChargeModel FromCustom(string value)
    {
        return new ChargeResponseChargeModel(value);
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

    public static bool operator ==(ChargeResponseChargeModel value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(ChargeResponseChargeModel value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(ChargeResponseChargeModel value) => value.Value;

    public static explicit operator ChargeResponseChargeModel(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Standard = "STANDARD";

        public const string Graduated = "GRADUATED";

        public const string Volume = "VOLUME";

        public const string Package = "PACKAGE";

        public const string Percentage = "PERCENTAGE";
    }
}
