export default async function handler(req, res) {
  const hostHeader = req.headers['host'];
  // جلوگیری از حلقه: اگر هدر Host خود پروکسی باشه، درخواست رو ریجکت کن
  if (!hostHeader || hostHeader.includes('vercel-proxy-rosy-xi.vercel.app')) {
    return res.status(400).send('Missing or invalid Host header');
  }

  const targetUrl = `https://${hostHeader}${req.url}`;

  try {
    const resp = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: hostHeader },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      redirect: 'follow',
    });
    const body = await resp.text();
    res.status(resp.status).send(body);
  } catch (e) {
    res.status(500).send(`Proxy error: ${e.message}`);
  }
}
