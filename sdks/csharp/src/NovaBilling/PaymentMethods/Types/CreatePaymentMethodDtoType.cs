using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<CreatePaymentMethodDtoType>))]
[Serializable]
public readonly record struct CreatePaymentMethodDtoType : IStringEnum
{
    public static readonly CreatePaymentMethodDtoType Card = new(Values.Card);

    public static readonly CreatePaymentMethodDtoType BankAccount = new(Values.BankAccount);

    public static readonly CreatePaymentMethodDtoType Wallet = new(Values.Wallet);

    public CreatePaymentMethodDtoType(string value)
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
    public static CreatePaymentMethodDtoType FromCustom(string value)
    {
        return new CreatePaymentMethodDtoType(value);
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

    public static bool operator ==(CreatePaymentMethodDtoType value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(CreatePaymentMethodDtoType value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(CreatePaymentMethodDtoType value) => value.Value;

    public static explicit operator CreatePaymentMethodDtoType(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Card = "CARD";

        public const string BankAccount = "BANK_ACCOUNT";

        public const string Wallet = "WALLET";
    }
}
