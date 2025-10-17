import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { user } from "./auth";
import { vacancies } from "./vacancy";
import { resumes } from "./resume";
import { relations } from "drizzle-orm";

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
}));
