CREATE TYPE "public"."vacancy_statuses" AS ENUM('ARCHIVE', 'ACTIVE');--> statement-breakpoint
CREATE TYPE "public"."vacancy_types" AS ENUM('JOB', 'INTERNSHIP');--> statement-breakpoint
CREATE TYPE "public"."work_format_types" AS ENUM('REMOTE', 'OFFICE', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "vacancies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL,
	"responsibilities" varchar(255)[] NOT NULL,
	"requirements" varchar(255)[] NOT NULL,
	"conditions" varchar(255)[] NOT NULL,
	"skills" varchar(255)[] NOT NULL,
	"company_id" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"workFormat" "work_format_types" NOT NULL,
	"type" "vacancy_types" NOT NULL,
	"salary_from" integer,
	"salary_to" integer,
	"expires_at" timestamp NOT NULL,
	"status" "vacancy_statuses" DEFAULT 'ARCHIVE' NOT NULL,
	"file_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"vacancy_id" varchar(255),
	"resume_id" varchar(255),
	"status" "request_status" NOT NULL,
	"text" text
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"request_id" varchar(255) NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_company_id_organizations_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_vacancy_id_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."vacancies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;