function isJsonContentType(contentType) {
  return /(^|\s|;)application\/(?:[\w.-]+\+)?json(?:\s*;|$)/i.test(
    contentType,
  );
}

function responseLabel(response, requestedUrl) {
  return requestedUrl || response.url || "the requested endpoint";
}

export async function parseJsonResponse(
  response,
  requestedUrl,
  { requireOk = true } = {},
) {
  const label = responseLabel(response, requestedUrl);
  const contentType = response.headers.get("content-type") || "";

  if (requireOk && !response.ok) {
    throw new Error(
      `JSON request to ${label} failed with HTTP ${response.status}.`,
    );
  }

  if (!isJsonContentType(contentType)) {
    throw new Error(
      `Expected JSON from ${label}, but received ${contentType || "an unknown content type"}.`,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Received invalid JSON from ${label}.`, { cause: error });
  }
}

export async function fetchJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
  });

  return parseJsonResponse(response, String(url));
}
