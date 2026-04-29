export default async function handler(req, res) {
  const hostHeader = req.headers['host'];
  if (!hostHeader) {
    res.status(400).send('Missing Host header');
    return;
  }

  const targetUrl = `https://${hostHeader}${req.url}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: hostHeader,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      redirect: 'follow',
    });

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
}
