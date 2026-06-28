export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const bookUrl = url.searchParams.get('url');

  if (!bookUrl) {
    return new Response('Missing book URL', { status: 400 });
  }

  if (
    !bookUrl.startsWith('https://www.gutenberg.org/') &&
    !bookUrl.startsWith('https://gutenberg.org/')
  ) {
    return new Response('Invalid book URL', { status: 400 });
  }

  const response = await fetch(bookUrl, {
    headers: {
      'User-Agent': 'Random Reads Reader'
    }
  });

  if (!response.ok) {
    return new Response('Could not fetch book text', { status: response.status });
  }

  const text = await response.text();

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
