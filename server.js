const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

// Intercepts and formats proxy streams dynamically
app.use('/service', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: Missing target URL parameter.');
    }

    // Force a dummy base target to satisfy the middleware initializer
    createProxyMiddleware({
        target: 'https://google.com', 
        changeOrigin: true,
        followRedirects: true,
        // The router function overrides the dummy target with your actual destination URL
        router: () => targetUrl, 
        pathRewrite: { '^/service': '' },
        on: {
            proxyRes: (proxyRes) => {
                // Instantly vaporises anti-framing rules so Discord/Games can render inside your window
                delete proxyRes.headers['x-frame-options'];
                delete proxyRes.headers['content-security-policy'];
                delete proxyRes.headers['clear-site-data'];
            },
            proxyReq: (proxyReq) => {
                proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            }
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`🌺 Proxy Engine Operational on Port ${PORT}`);
});
