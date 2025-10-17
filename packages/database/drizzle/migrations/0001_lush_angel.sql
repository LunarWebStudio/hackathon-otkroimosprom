CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."organization_requests_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "organization_requests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL,
	"inn" varchar(255),
	"orgn" varchar(255),
	"kpp" varchar(255),
	"address" text,
	"lawAddress" text,
	"contacts" text,
	"status" "organization_requests_status" DEFAULT 'PENDING' NOT NULL,
	"createdById" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL,
	"inn" varchar(255),
	"orgn" varchar(255),
	"kpp" varchar(255),
	"address" text,
	"lawAddress" text,
	"contacts" text,
	"managerId" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "company_id" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "university_name" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "organization_requests" ADD CONSTRAINT "organization_requests_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_managerId_user_id_fk" FOREIGN KEY ("managerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;