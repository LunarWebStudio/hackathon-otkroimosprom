import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { resumes } from "./resume";
import { relations } from "drizzle-orm";

export const specialties = pg.pgTable("specialties", {
	...commonFields,
	name: pg.varchar({ length: 255 }).notNull(),
});

export const resumeRelations = relations(resumes, ({ one }) => ({
	speciality: one(specialties, {
		fields: [resumes.specialtyId],
		references: [specialties.id],
	}),
}));

export const specialityRelations = relations(specialties, ({ many }) => ({
	resumes: many(resumes),
}));
