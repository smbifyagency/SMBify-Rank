/**
 * Legacy database connection - NOT used in production.
 * 
 * The app now uses Supabase JS client for all storage (see supabase-storage.ts).
 * This file is kept only because some Drizzle schema types are imported elsewhere.
 * The db/pool exports will throw if DATABASE_URL is not set, which is expected
 * since we don't use them.
 */
import * as schema from "../shared/schema.js";

// Export schema for type usage only
export { schema };

// These are only used by the old DatabaseStorage class (not active in production)
export const pool = null as any;
export const db = null as any;