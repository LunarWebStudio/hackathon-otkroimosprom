import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const skill = pgTable("skill", {
    ...commonFields,
    name: varchar("name", {length: 255}).notNull()
})


const skillsToUsers = pgTable("skills_to_users", {
    ...commonFields,
    userId: varchar("user_id", {length: 255}).notNull().references(() => user.id),
    skillId: varchar("skill_id", {length: 255}).notNull().references(() => skill.id)
})

export const skillRelations = relations(skill, ({ many }) => ({
	users: many(skillsToUsers),
}));


export const userRelations = relations(user, ({ many }) => ({
	skills: many(skillsToUsers),
}));


export const skillsToUsersRelations = relations(skillsToUsers, ({ one }) => ({
	user: one(user, {
		fields: [skillsToUsers.userId],
		references: [user.id],
	}),
	skill: one(skill, {
		fields: [skillsToUsers.skillId],
		references: [skill.id],
	}),
}));