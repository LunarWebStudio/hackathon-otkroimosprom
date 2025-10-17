import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { resumes } from "./resume"; 
import { relations } from "drizzle-orm";

export const skill = pgTable("skill", {
	...commonFields,
	name: varchar("name", { length: 255 }).notNull(),
});

export const skillsToResumes = pgTable("skills_to_resumes", {
	...commonFields,
	resumeId: varchar("resume_id", { length: 255 })
		.notNull()
		.references(() => resumes.id),
	skillId: varchar("skill_id", { length: 255 })
		.notNull()
		.references(() => skill.id),
});

export const skillRelations = relations(skill, ({ many }) => ({
	resumes: many(skillsToResumes),
}));

export const resumeSkillRelations = relations(resumes, ({ many }) => ({
	skills: many(skillsToResumes),
}));

export const skillsToResumesRelations = relations(skillsToResumes, ({ one }) => ({
	resume: one(resumes, {
		fields: [skillsToResumes.resumeId],
		references: [resumes.id],
	}),
	skill: one(skill, {
		fields: [skillsToResumes.skillId],
		references: [skill.id],
	}),
}));
