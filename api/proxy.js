export default async function handler(request) {
  const hostHeader = request.headers.get('host');
  if (!hostHeader) return new Response('Missing Host header', { status: 400 });

  const url = new URL(request.url);
  const targetUrl = `https://${hostHeader}${url.pathname}${url.search}`;

  let body = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
  }

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('X-Forwarded-For', request.headers.get('x-forwarded-for') || '');

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      redirect: 'follow'
    });

    const resHeaders = new Headers(res.headers);
    resHeaders.delete('content-security-policy');
    resHeaders.delete('x-frame-options');
    resHeaders.set('access-control-allow-origin', '*');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders
    });
  } catch (e) {
    return new Response(`Proxy error: ${e.message}`, { status: 502 });
  }
}

export const config = {
  runtime: 'edge'
};
