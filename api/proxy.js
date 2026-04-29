export default async function handler(req, res) {
  // دریافت دامنه مقصد از هدر 'host'
  const targetHost = req.headers['host'];
  if (!targetHost) {
    res.status(400).send('Missing Host header');
    return;
  }

  // ساخت URL مقصد
  const targetUrl = `https://${targetHost}${req.url}`;

  try {
    // دریافت پاسخ از سرور مقصد
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        // حذف هدر 'host' اصلی و ارسال بقیه هدرها
        ...req.headers,
        host: targetHost,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      redirect: 'follow',
    });

    // ارسال پاسخ به کلاینت
    const responseBody = await response.text();
    res.status(response.status).send(responseBody);
  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
}

// مهم: حتماً این بخش را پاک کنید یا خط تولید را تغییر دهید
// export const config = {
//   runtime: 'edge'
// };
