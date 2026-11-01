import { get, put } from "@vercel/blob";

const blobPathname = "whitelist.json";
const jsonContentType = "application/json";
const maxRequestSize = 16 * 1024;

export async function GET() {
  const blob = await get(blobPathname, {
    access: "private",
    useCache: false,
  });

  if (!blob) {
    return Response.json([], {
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(blob.stream, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": jsonContentType,
    },
  });
}

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > maxRequestSize) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > maxRequestSize) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  let usernames;
  try {
    usernames = JSON.parse(body);
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    !Array.isArray(usernames) ||
    usernames.length > 20 ||
    usernames.some(
      (username) =>
        typeof username !== "string" ||
        username.length === 0 ||
        username.length > 64
    )
  ) {
    return Response.json(
      { error: "Expected an array of up to 20 valid usernames." },
      { status: 400 }
    );
  }

  await put(blobPathname, JSON.stringify(usernames), {
    access: "private",
    allowOverwrite: true,
    contentType: jsonContentType,
    cacheControlMaxAge: 60,
  });

  return Response.json({ success: true, count: usernames.length });
}
