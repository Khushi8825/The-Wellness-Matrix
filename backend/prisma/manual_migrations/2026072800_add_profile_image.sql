-- Run this once against the existing Wellness Matrix database.
-- This project's schema was introspected from an existing Postgres database
-- (see package.json "prisma:db:pull"), so there is no prisma migration
-- history — apply this SQL directly instead of `prisma migrate`.
--
--   psql "$DATABASE_URL" -f backend/prisma/manual_migrations/2026072800_add_profile_image.sql
--
-- After running this, regenerate the Prisma client so backend/prisma/schema.prisma
-- (which already declares the `profileImage` field) matches the DB:
--
--   npx prisma generate

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255);
