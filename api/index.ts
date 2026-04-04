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

export default async function handler(req: any, res: any) {
    if (!routesRegistered) {
        await registerRoutes(app);
        // Global error handler — catch anything Express doesn't handle
        app.use((err: any, _req: any, errRes: any, _next: any) => {
            console.error('Unhandled Express error:', err.message, err.stack);
            errRes.status(err.statusCode || err.status || 500).json({
                error: err.message || 'Internal Server Error',
                type: err.type || 'unknown',
                source: 'api-error-handler',
            });
        });
        routesRegistered = true;
    }
    return app(req, res);
}
