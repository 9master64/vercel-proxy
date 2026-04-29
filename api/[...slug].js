export default async function handler(req, res) {
  const host = req.headers.host;
  if (!host || host.includes('vercel.app')) {
    return res.status(400).send('Missing or invalid Host header');
  }
  const url = `https://${host}${req.url}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: { ...req.headers, host },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      redirect: 'follow',
    });
    const body = await response.text();
    res.status(response.status).send(body);
  } catch (e) {
    res.status(500).send(`Proxy error: ${e.message}`);
  }
}
