import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

proxy.on('proxyReq', (proxyReq, req) => {
  console.log("[PROXY REQ EVENT] Outgoing X-Forwarded-For: " + (proxyReq.getHeader('x-forwarded-for') || 'none'));
  console.log("[PROXY REQ EVENT] Outgoing X-Real-IP: " + (proxyReq.getHeader('x-real-ip') || 'none'));
});

proxy.on('proxyRes', (proxyRes, req) => {
  console.log("[PROXY RES EVENT] Status code: " + proxyRes.statusCode + " for " + req.method + " " + req.url);
});

proxy.on('error', (err, req, res) => {
  console.error("[PROXY ERROR EVENT] Error:", err, err.stack);
});

// Vercel Serverless Function to proxy /api requests to Hugging Face
export default function handler(req, res) {
  console.log("[PROXY INCOMING] Method: " + req.method + ", Path: " + req.url);
  console.log("[PROXY INCOMING] X-Forwarded-For: " + (req.headers['x-forwarded-for'] || 'none'));
  console.log("[PROXY INCOMING] X-Real-IP: " + (req.headers['x-real-ip'] || 'none'));

  return new Promise((resolve, reject) => {
    const target = process.env.HF_SPACE_URL || 'http://localhost:3000';
    
    // Inject the secure Hugging Face Access Token if running in production
    if (process.env.HF_API_KEY) {
      req.headers['authorization'] = `Bearer ${process.env.HF_API_KEY}`;
    }

    console.log("[PROXY] Executing proxy.web with target: " + target);
    proxy.web(req, res, {
      target: target,
      changeOrigin: true,
      secure: true, // Validate SSL certs
    }, (err) => {
      if (err) {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Proxy error', details: err.message });
        }
      }
      resolve();
    });
  });
}
