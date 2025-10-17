import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { resumes } from "./resume";
import { relations } from "drizzle-orm";

export const speciality = pgTable("speciality", {
	...commonFields,
	name: varchar("name", { length: 255 }).notNull(),
});

export const resumeRelations = relations(resumes, ({ one }) => ({
	speciality: one(speciality, {
		fields: [resumes.specialtyId],
		references: [speciality.id],
	}),
}));

export const specialityRelations = relations(speciality, ({ many }) => ({
	resumes: many(resumes),
}));
