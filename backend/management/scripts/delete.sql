-- 1. Drop all views in the schema
DO
$$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.views
        WHERE table_schema = 'siratRevival'
    LOOP
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', r.table_schema, r.table_name);
    END LOOP;
END
$$;


-- 2. Drop all tables in the schema
DO
$$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema = 'siratRevival' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', r.table_schema, r.table_name);
    END LOOP;
END
$$;


-- 3. Drop all enum types in the schema
DO
$$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT n.nspname as schema, t.typname as enum_name
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'siratRevival'
        GROUP BY n.nspname, t.typname
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE', r.schema, r.enum_name);
    END LOOP;
END
$$;
