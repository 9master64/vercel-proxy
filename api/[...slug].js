export default async function handler(req, res) {
  const hostHeader = req.headers['host'];

  // جلوگیری از حلقه: اگه درخواست برای خود پروکسی یا دامنه‌های ورسل باشه، ردش می‌کنیم.
  if (!hostHeader || hostHeader.includes('vercel.app') || hostHeader.includes('vercel-proxy')) {
    return res.status(400).send('Missing or invalid Host header');
  }

  try {
    const targetUrl = `https://${hostHeader}${req.url}`;
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
