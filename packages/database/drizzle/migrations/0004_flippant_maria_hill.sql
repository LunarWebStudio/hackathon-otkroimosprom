CREATE TYPE "public"."education_level" AS ENUM('PRIMARY', 'BASIC', 'SECONDARY', 'VOCATIONAL_SECONDARY', 'HIGHER');--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "university" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "resumes" ADD COLUMN "educationLevel" "education_level";