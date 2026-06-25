export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  let source = searchParams.get("url");

  if (!source) {
    return new Response("Missing URL", { status: 400 });
  }

  source = source.replace("http://", "https://");

  if (!source.startsWith("https://www.gutenberg.org/")) {
    return new Response("Invalid Gutenberg URL", { status: 400 });
  }

  const response = await fetch(source, {
    headers: {
      "User-Agent": "Random Reads Reader"
    }
  });

  if (!response.ok) {
    return new Response("Could not fetch Gutenberg text", { status: 502 });
  }

  const text = await response.text();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
