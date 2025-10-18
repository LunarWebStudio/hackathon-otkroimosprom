ALTER TABLE "vacancies" RENAME COLUMN "skills" TO "skillIds";--> statement-breakpoint
ALTER TABLE "vacancies" DROP CONSTRAINT "vacancies_file_id_files_id_fk";
--> statement-breakpoint
ALTER TABLE "vacancies" ALTER COLUMN "responsibilities" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vacancies" ALTER COLUMN "requirements" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vacancies" ALTER COLUMN "conditions" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vacancies" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "vacancies" ALTER COLUMN "status" SET DATA TYPE "public"."organization_requests_status" USING "status"::text::"public"."organization_requests_status";--> statement-breakpoint
ALTER TABLE "vacancies" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "vacancies" ADD COLUMN "specialtyId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_specialtyId_specialties_id_fk" FOREIGN KEY ("specialtyId") REFERENCES "public"."specialties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" DROP COLUMN "courses";--> statement-breakpoint
ALTER TABLE "vacancies" DROP COLUMN "file_id";--> statement-breakpoint
DROP TYPE "public"."vacancy_statuses";