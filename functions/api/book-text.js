export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const rawBookUrl = requestUrl.searchParams.get('url');

  if (!rawBookUrl) {
    return new Response('Missing book URL', { status: 400 });
  }

  let bookUrl;

  try {
    bookUrl = new URL(rawBookUrl);
  } catch {
    return new Response('Invalid book URL', { status: 400 });
  }

  const allowedHosts = [
    'www.gutenberg.org',
    'gutenberg.org'
  ];

  if (!allowedHosts.includes(bookUrl.hostname)) {
    return new Response(`Blocked host: ${bookUrl.hostname}`, { status: 400 });
  }

  const response = await fetch(bookUrl.toString(), {
    headers: {
      'User-Agent': 'Random Reads Reader'
    }
  });

  if (!response.ok) {
    return new Response(`Could not fetch book text: ${response.status}`, {
      status: response.status
    });
  }

  const text = await response.text();

  return new Response(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
