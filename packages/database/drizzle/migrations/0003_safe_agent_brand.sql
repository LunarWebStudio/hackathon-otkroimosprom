ALTER TYPE "public"."user_roles" ADD VALUE 'COMPANY_MANAGER' BEFORE 'HR';--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "lawAddress";