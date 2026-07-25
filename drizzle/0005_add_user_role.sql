CREATE TYPE "user_role" AS ENUM ('user', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" NOT NULL DEFAULT 'user';