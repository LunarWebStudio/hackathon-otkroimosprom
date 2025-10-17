import * as pg from "drizzle-orm/pg-core"
import { commonFields } from "./utils"
import { organizations } from "./organization"
import { relations } from "drizzle-orm";

export const workFormatTypes = pg.pgEnum(
    "work_format_types",
    ["REMOTE", "OFFICE", "HYBRID"],
);

export const vacancyTupes = pg.pgEnum("vacancy_types", ["JOB", "INTERNSHIP"])

export const vacancyStatuses = pg.pgEnum("vacancy_statuses", ["ARCHIVE", "ACTIVE"])



export const vacancies = pg.pgTable("vacancies", {
    ...commonFields,
    name: pg.varchar({length: 255}).notNull(),
    responsibilities: pg.varchar({length: 255}).notNull().array().notNull(),
    requirements: pg.varchar({length: 255}).notNull().array().notNull(),
    conditions: pg.varchar({length: 255}).notNull().array().notNull(),
    skills: pg.varchar({length: 255}).notNull().array().notNull(),
    companyId: pg.varchar("company_id", {length: 255}).notNull().references(() => organizations.id),
    address: pg.varchar({length: 255}).notNull(),
    workFormat: workFormatTypes().notNull(),
    type: vacancyTupes().notNull(),
    salaryFrom: pg.integer("salary_from"),
    salaryTo: pg.integer("salary_to"),
    expiresAt: pg.timestamp("expires_at").notNull(),
    status: vacancyStatuses().notNull().default("ARCHIVE")
})


export const vacanciesRelations = relations(vacancies, ({one}) => ({
    organization: one(organizations, {
        fields: [vacancies.companyId],
        references: [organizations.id]
    })
}))