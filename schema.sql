
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE TYPE "public"."Role" AS ENUM (
    'USER',
    'ADMIN'
);

ALTER TYPE "public"."Role" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."mails" (
    "id" "text" NOT NULL,
    "from" "text" NOT NULL,
    "to" "text" NOT NULL,
    "subject" "text" NOT NULL,
    "text" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "hash" "text" NOT NULL
);

ALTER TABLE "public"."mails" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."puk" (
    "id" "text" NOT NULL,
    "key" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" "text" NOT NULL
);

ALTER TABLE "public"."puk" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "text" NOT NULL,
    "username" "text",
    "name" "text",
    "email" "text",
    "emailVerified" timestamp(3) without time zone,
    "password" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "role" "public"."Role" DEFAULT 'USER'::"public"."Role" NOT NULL,
    "privateKey" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."verifications" (
    "id" "text" NOT NULL,
    "otp" "text" NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "email" "text" NOT NULL
);

ALTER TABLE "public"."verifications" OWNER TO "postgres";

ALTER TABLE ONLY "public"."mails"
    ADD CONSTRAINT "mails_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."puk"
    ADD CONSTRAINT "puk_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."verifications"
    ADD CONSTRAINT "verifications_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "puk_userId_key" ON "public"."puk" USING "btree" ("userId");

CREATE INDEX "users_email_idx" ON "public"."users" USING "btree" ("email");

CREATE UNIQUE INDEX "users_email_key" ON "public"."users" USING "btree" ("email");

CREATE INDEX "verifications_email_idx" ON "public"."verifications" USING "btree" ("email");

ALTER TABLE ONLY "public"."puk"
    ADD CONSTRAINT "puk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;

RESET ALL;
