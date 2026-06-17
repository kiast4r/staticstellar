const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Host our Y2K themed public files
app.use(express.static(path.join(__dirname, 'public')));

// Intercept, unpack, and rewrite outbound restricted data feeds
app.use('/service', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: Provide a URL path pointer.');
    }

    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: { '^/service': '' },
        router: (req) => req.query.url,
        logger: console,
        on: {
            proxyRes: (proxyRes, req, res) => {
                // Eradicate structural headers designed to block framing/embedding
                delete proxyRes.headers['x-frame-options'];
                delete proxyRes.headers['content-security-policy'];
                delete proxyRes.headers['clear-site-data'];
            },
            proxyReq: (proxyReq, req, res) => {
                // Impersonate standard device requests
                proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            }
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`🌺 Interstellar Hibiscus Online: http://localhost:${PORT}`);
});
