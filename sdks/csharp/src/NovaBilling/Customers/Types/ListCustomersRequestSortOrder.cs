using System.Text.Json.Serialization;
using NovaBilling.Core;

namespace NovaBilling;

[JsonConverter(typeof(StringEnumSerializer<ListCustomersRequestSortOrder>))]
[Serializable]
public readonly record struct ListCustomersRequestSortOrder : IStringEnum
{
    public static readonly ListCustomersRequestSortOrder Asc = new(Values.Asc);

    public static readonly ListCustomersRequestSortOrder Desc = new(Values.Desc);

    public ListCustomersRequestSortOrder(string value)
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
    public static ListCustomersRequestSortOrder FromCustom(string value)
    {
        return new ListCustomersRequestSortOrder(value);
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

    public static bool operator ==(ListCustomersRequestSortOrder value1, string value2) =>
        value1.Value.Equals(value2);

    public static bool operator !=(ListCustomersRequestSortOrder value1, string value2) =>
        !value1.Value.Equals(value2);

    public static explicit operator string(ListCustomersRequestSortOrder value) => value.Value;

    public static explicit operator ListCustomersRequestSortOrder(string value) => new(value);

    /// <summary>
    /// Constant strings for enum values
    /// </summary>
    [Serializable]
    public static class Values
    {
        public const string Asc = "asc";

        public const string Desc = "desc";
    }
}
