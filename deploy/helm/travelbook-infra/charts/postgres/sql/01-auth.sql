SET client_min_messages TO WARNING;

CREATE SCHEMA IF NOT EXISTS partman;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_partman SCHEMA partman;

SELECT cron.schedule_in_database(
    'outbox_maintenance_auth',
    '30 2 * * *',
    $$SELECT partman.run_maintenance();$$,
    'tb_auth_db'
);

SELECT cron.schedule_in_database(
    'outbox_maintenance_property',
    '35 2 * * *',
    $$SELECT partman.run_maintenance();$$,
    'tb_property_db'
);

SELECT cron.schedule_in_database(
    'outbox_maintenance_review',
    '40 2 * * *',
    $$SELECT partman.run_maintenance();$$,
    'tb_review_db'
);
