import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { organizations } from "./organization";
import { relations } from "drizzle-orm";
import { specialties } from "./speciality";

export const workFormatTypes = pg.pgEnum("work_format_types", [
	"REMOTE",
	"OFFICE",
	"HYBRID",
]);

export const vacancyTypes = pg.pgEnum("vacancy_types", ["JOB", "INTERNSHIP"]);

export const vacancies = pg.pgTable("vacancies", {
	...commonFields,
	name: pg.varchar({ length: 255 }).notNull(),
	responsibilities: pg.text().notNull(),
	requirements: pg.text().notNull(),
	conditions: pg.text().notNull(),
	specialtyId: pg
		.varchar({ length: 255 })
		.notNull()
		.references(() => specialties.id),
	skillIds: pg.varchar({ length: 255 }).notNull().array().notNull(),
	organizationId: pg
		.varchar("company_id", { length: 255 })
		.notNull()
		.references(() => organizations.id),
	address: pg.varchar({ length: 255 }).notNull(),
	workFormat: workFormatTypes().notNull(),
	type: vacancyTypes().notNull(),
	salaryFrom: pg.integer("salary_from"),
	salaryTo: pg.integer("salary_to"),
	expiresAt: pg.timestamp("expires_at").notNull(),
});

export const vacanciesRelations = relations(vacancies, ({ one }) => ({
	organization: one(organizations, {
		fields: [vacancies.organizationId],
		references: [organizations.id],
	}),
}));
