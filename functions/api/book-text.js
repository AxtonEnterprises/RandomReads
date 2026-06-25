export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const source = searchParams.get('url');

  if (!source) {
    return new Response('Missing Gutenberg URL', { status: 400 });
  }

  const safeSource = source.replace(/^http:\/\//i, 'https://');

  if (!safeSource.includes('gutenberg.org')) {
    return new Response('Only Gutenberg URLs are allowed', { status: 400 });
  }

  const gutenbergResponse = await fetch(safeSource);

  if (!gutenbergResponse.ok) {
    return new Response(`Gutenberg fetch failed: ${gutenbergResponse.status}`, {
      status: 502
    });
  }

  const text = await gutenbergResponse.text();

  return new Response(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
