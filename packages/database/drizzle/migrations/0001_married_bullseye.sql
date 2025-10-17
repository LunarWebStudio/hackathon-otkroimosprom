ALTER TABLE "organization_requests" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "organization_requests" CASCADE;--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "company_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "status" "organization_requests_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;