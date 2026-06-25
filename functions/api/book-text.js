export async function onRequestGet(context) {
  const url = context.request.url;
  const { searchParams } = new URL(url);
  const source = searchParams.get("url");

  if (!source || !source.startsWith("https://www.gutenberg.org/")) {
    return new Response("Invalid Gutenberg URL", { status: 400 });
  }

  const response = await fetch(source);

  if (!response.ok) {
    return new Response("Could not fetch Gutenberg text", { status: 502 });
  }

  const text = await response.text();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
