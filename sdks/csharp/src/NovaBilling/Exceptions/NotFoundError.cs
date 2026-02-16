namespace NovaBilling;

/// <summary>
/// This exception type will be thrown for any non-2XX API responses.
/// </summary>
[Serializable]
public class NotFoundError(object body) : NovabillingApiApiException("NotFoundError", 404, body);
