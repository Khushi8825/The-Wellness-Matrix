-- Run this once against the existing Wellness Matrix database.
-- Phase 2 of the Agentic AI upgrade: prescription analyses were previously
-- generated and shown once, never saved. This table persists each analysis
-- so the Health Coordinator can pull the user's latest prescription
-- automatically. No existing table is touched by this migration.
--
--   psql "$DATABASE_URL" -f backend/prisma/manual_migrations/2026080601_add_prescriptions.sql
--
-- After running this, regenerate the Prisma client so backend/prisma/schema.prisma
-- (which already declares the `Prescription` model) matches the DB:
--
--   npx prisma generate

CREATE TABLE IF NOT EXISTS prescriptions (
  id                   BIGSERIAL PRIMARY KEY,
  user_id              INTEGER NOT NULL,
  medicines            JSONB NOT NULL,
  doctor_instructions  JSONB,
  overall_confidence   VARCHAR(20),
  unreadable_notes     TEXT,
  created_at           TIMESTAMP(6) NOT NULL DEFAULT now(),
  CONSTRAINT fk_prescription_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Speeds up "give me this user's latest prescription" (the exact query the
-- Health Coordinator runs on every dashboard load).
CREATE INDEX IF NOT EXISTS idx_prescriptions_user_created
  ON prescriptions (user_id, created_at DESC);
