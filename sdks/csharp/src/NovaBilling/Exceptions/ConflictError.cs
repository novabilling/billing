namespace NovaBilling;

/// <summary>
/// This exception type will be thrown for any non-2XX API responses.
/// </summary>
[Serializable]
public class ConflictError(object body) : NovabillingApiApiException("ConflictError", 409, body);
