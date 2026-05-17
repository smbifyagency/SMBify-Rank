-- SMBify Rank Supabase RLS hardening
--
-- Run this once in the Supabase SQL Editor as the postgres user.
-- It does two things:
--   1. Enables + forces RLS on every existing table in the public schema.
--   2. Auto-enables + forces RLS on every future table created in public.
--
-- This app is safe with this setup because browser code does not read/write
-- app tables directly. Data access happens through the backend, which should
-- use SUPABASE_SECRET_KEY (preferred) or SUPABASE_SERVICE_ROLE_KEY.
--
-- IMPORTANT:
-- - This script intentionally does NOT create anon/authenticated policies.
-- - With RLS enabled and no policies, browser/API access is denied by default.
-- - If you later need direct client access to a table, add an explicit policy.

begin;

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.enable_rls_on_existing_public_tables()
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  tbl record;
begin
  for tbl in
    select schemaname, tablename
    from pg_tables
    where schemaname = 'public'
      and tablename not like 'pg_%'
      and tablename <> 'spatial_ref_sys'
  loop
    execute format('alter table %I.%I enable row level security', tbl.schemaname, tbl.tablename);
    execute format('alter table %I.%I force row level security', tbl.schemaname, tbl.tablename);
  end loop;
end;
$$;

select private.enable_rls_on_existing_public_tables();

create or replace function private.rls_auto_enable()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table', 'partitioned table')
  loop
    if cmd.schema_name is not null
       and cmd.schema_name = 'public'
       and cmd.schema_name not in ('pg_catalog', 'information_schema')
       and cmd.schema_name not like 'pg_toast%'
       and cmd.schema_name not like 'pg_temp%'
    then
      begin
        execute format('alter table if exists %s enable row level security', cmd.object_identity);
        execute format('alter table if exists %s force row level security', cmd.object_identity);
        raise log 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      exception
        when others then
          raise log 'rls_auto_enable: failed to enable RLS on %: %', cmd.object_identity, sqlerrm;
      end;
    end if;
  end loop;
end;
$$;

drop event trigger if exists ensure_rls_on_public_tables;

create event trigger ensure_rls_on_public_tables
on ddl_command_end
when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
execute function private.rls_auto_enable();

commit;

-- Audit query: run this after the script and whenever you want to verify status.
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname = 'public'
order by c.relname;