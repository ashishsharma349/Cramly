import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

// Vercel Serverless Function to proxy /api requests to Hugging Face
export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    const target = process.env.HF_SPACE_URL || 'http://localhost:3000';
    
    // Inject the secure Hugging Face Access Token if running in production
    if (process.env.HF_API_KEY) {
      req.headers['authorization'] = `Bearer ${process.env.HF_API_KEY}`;
    }

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
