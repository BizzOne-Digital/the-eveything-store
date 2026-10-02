/**
 * Safely parses a fetch Response as JSON. On a transient server error (cold
 * start, timeout, etc.) the body can be empty or non-JSON, which makes a bare
 * `res.json()` throw a confusing "Unexpected end of JSON input" error before
 * the caller ever checks `res.ok`. This normalizes that into a clear message.
 */
export async function parseJsonResponse<T = Record<string, unknown>>(
  res: Response
): Promise<T> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : undefined) ||
      `Something went wrong (${res.status}). Please try again in a moment.`;
    throw new Error(message);
  }

  return (data ?? {}) as T;
}
