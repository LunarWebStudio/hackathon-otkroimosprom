CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('USER', 'ADMIN', 'HR');--> statement-breakpoint
CREATE TYPE "public"."organization_requests_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"email_verified" boolean NOT NULL,
	"image" text,
	"company_id" varchar,
	"university_name" varchar,
	"gender" "gender",
	"role" "user_roles" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"content_type" varchar(255) NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "resumes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"title" varchar(255) NOT NULL,
	"photoId" varchar(255),
	"birthDate" timestamp,
	"gender" "gender",
	"phoneNumber" varchar(255),
	"email" varchar(255),
	"skillIds" varchar(255)[] NOT NULL,
	"experience" varchar(255),
	"courses" varchar(255)[] NOT NULL,
	"description" varchar(255),
	"fileId" varchar(255),
	"citizenship" varchar(255),
	"specialtyId" varchar(255) NOT NULL,
	"userId" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "specialties" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills_to_resumes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"resume_id" varchar(255) NOT NULL,
	"skill_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_requests" ADD CONSTRAINT "organization_requests_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_managerId_user_id_fk" FOREIGN KEY ("managerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_photoId_files_id_fk" FOREIGN KEY ("photoId") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_specialtyId_specialties_id_fk" FOREIGN KEY ("specialtyId") REFERENCES "public"."specialties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills_to_resumes" ADD CONSTRAINT "skills_to_resumes_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills_to_resumes" ADD CONSTRAINT "skills_to_resumes_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;