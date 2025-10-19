import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { resumes } from "./resume";
import { relations } from "drizzle-orm";
export const skills = pg.pgTable("skills", {
    ...commonFields,
    name: pg.varchar({ length: 255 }).notNull(),
});
export const skillsToResumes = pg.pgTable("skills_to_resumes", {
    ...commonFields,
    resumeId: pg
        .varchar("resume_id", { length: 255 })
        .notNull()
        .references(() => resumes.id),
    skillId: pg
        .varchar("skill_id", { length: 255 })
        .notNull()
        .references(() => skills.id),
});
export const skillRelations = relations(skills, ({ many }) => ({
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
    skill: one(skills, {
        fields: [skillsToResumes.skillId],
        references: [skills.id],
    }),
}));
