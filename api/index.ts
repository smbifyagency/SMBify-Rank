import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Trust Vercel's reverse proxy so secure cookies work
app.set('trust proxy', 1);

// Vercel's @vercel/node runtime may pre-parse the body or consume the stream.
// Wrap express.json() with an error handler to gracefully fall back when parsing fails.
app.use((req: any, res: any, next: any) => {
    // If Vercel already populated req.body with parsed content, skip express.json()
    if (req.body !== undefined && req.body !== null && typeof req.body === 'object') {
        return next();
    }
    express.json({ limit: '50mb' })(req, res, (err: any) => {
        if (err) {
            // Body parsing failed — try to read raw body manually
            console.error('express.json() failed:', err.message, 'type:', err.type);
            if (!req.body) req.body = {};
        }
        next();
    });
});
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let routesRegistered = false;

// Debug endpoint to check what Vercel sends to the handler
app.get('/api/debug-health', (req: any, res: any) => {
    res.json({
        ok: true,
        url: req.url,
        originalUrl: req.originalUrl,
        path: req.path,
        method: req.method,
        hasBody: !!req.body,
        bodyType: typeof req.body,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        headers: {
            contentType: req.headers['content-type'],
            contentLength: req.headers['content-length'],
        },
        ts: new Date().toISOString(),
    });
});

export default async function handler(req: any, res: any) {
    if (!routesRegistered) {
        await registerRoutes(app);
        routesRegistered = true;
    }
    return app(req, res);
}
