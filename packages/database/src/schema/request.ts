import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { vacancies } from "./vacancy";
import { resumes } from "./resume";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { organizations } from "./organization";

export const requestStatus = pg.pgEnum("request_status", [
	"PENDING",
	"ACCEPTED",
	"REJECTED",
]);

export const requests = pg.pgTable("requests", {
	...commonFields,
	vacancyId: pg
		.varchar("vacancy_id", { length: 255 })
		.references(() => vacancies.id),
	resumeId: pg
		.varchar("resume_id", { length: 255 })
		.references(() => resumes.id),
	userId: pg
		.varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id),
	organizationId: pg
		.varchar("organization_id", { length: 255 })
		.notNull()
		.references(() => organizations.id),
	status: requestStatus().notNull().default("PENDING"),
	text: pg.text("text"),
});

export const requestsRelation = relations(requests, ({ one }) => ({
	vacancy: one(vacancies, {
		fields: [requests.vacancyId],
		references: [vacancies.id],
	}),
	resume: one(resumes, {
		fields: [requests.resumeId],
		references: [resumes.id],
	}),
	user: one(user, {
		fields: [requests.userId],
		references: [user.id],
	}),
	organization: one(organizations, {
		fields: [requests.organizationId],
		references: [organizations.id],
	}),
}));
