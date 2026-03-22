import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Trust Vercel's reverse proxy so secure cookies work
app.set('trust proxy', 1);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let routesRegistered = false;

export default async function handler(req: any, res: any) {
    if (!routesRegistered) {
        await registerRoutes(app);
        routesRegistered = true;
    }
    return app(req, res);
}
