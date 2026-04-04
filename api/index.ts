import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Trust Vercel's reverse proxy so secure cookies work
app.set('trust proxy', 1);

// Vercel's @vercel/node runtime pre-parses JSON bodies and consumes the stream.
// If we let express.json() run after that, it sees Content-Length > 0 but an empty
// stream, and throws a 400 "Bad Request".  Fix: skip express.json() when Vercel
// has already populated req.body.
app.use((req: any, _res: any, next: any) => {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        // Body already parsed by Vercel — skip express.json()
        return next();
    }
    express.json({ limit: '50mb' })(req, _res, next);
});
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let routesRegistered = false;

export default async function handler(req: any, res: any) {
    if (!routesRegistered) {
        await registerRoutes(app);
        routesRegistered = true;
    }
    return app(req, res);
}
