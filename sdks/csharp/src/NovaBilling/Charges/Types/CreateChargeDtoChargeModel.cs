using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreateChargeDtoChargeModel>))]
[Serializable]
public readonly record struct CreateChargeDtoChargeModel : IStringEnum
{
    public static readonly CreateChargeDtoChargeModel Standard = new(Values.Standard);

    public static readonly CreateChargeDtoChargeModel Graduated = new(Values.Graduated);

    public static readonly CreateChargeDtoChargeModel Volume = new(Values.Volume);

    public static readonly CreateChargeDtoChargeModel Package = new(Values.Package);

    public static readonly CreateChargeDtoChargeModel Percentage = new(Values.Percentage);

    public CreateChargeDtoChargeModel(string value)
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
    public static CreateChargeDtoChargeModel FromCustom(string value)
    {
        return new CreateChargeDtoChargeModel(value);
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

    public static bool operator ==(CreateChargeDtoChargeModel value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreateChargeDtoChargeModel value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreateChargeDtoChargeModel value) => value.Value;

    public static explicit operator CreateChargeDtoChargeModel(string value) => new(value);

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
