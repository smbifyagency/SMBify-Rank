/**
 * Legacy migration file - NOT used in production.
 * 
 * Database tables are now created directly in Supabase SQL Editor.
 * See supabase/rls-hardening.sql for the security hardening script that
 * enables RLS on existing tables and auto-enables it for new public tables.
 */
export async function runMigrations() {
  console.log('Migrations are handled by Supabase — skipping');
}
