import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { resumes } from "./resume"; 
import { relations } from "drizzle-orm";

export const profession = pgTable("profession", {
	...commonFields,
	name: varchar("name", { length: 255 }).notNull(),
});

export const professionsToResumes = pgTable("professions_to_resumes", {
	...commonFields,
	resumeId: varchar("resume_id", { length: 255 })
		.notNull()
		.references(() => resumes.id),
	professionId: varchar("profession_id", { length: 255 })
		.notNull()
		.references(() => profession.id),
});


export const professionRelations = relations(profession, ({ many }) => ({
	resumes: many(professionsToResumes),
}));

export const resumeRelations = relations(resumes, ({ many }) => ({
	professions: many(professionsToResumes),
}));

export const professionsToResumesRelations = relations(
	professionsToResumes,
	({ one }) => ({
		resume: one(resumes, {
			fields: [professionsToResumes.resumeId],
			references: [resumes.id],
		}),
		profession: one(profession, {
			fields: [professionsToResumes.professionId],
			references: [profession.id],
		}),
	}),
);
