import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const profession = pgTable("profession", {
	...commonFields,
	name: varchar("name", { length: 255 }).notNull(),
});

export const professionsToUsers = pgTable("professions_to_users", {
	...commonFields,
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id),
	professionId: varchar("profession_id", { length: 255 })
		.notNull()
		.references(() => profession.id),
});

export const professionRelations = relations(profession, ({ many }) => ({
	users: many(professionsToUsers),
}));

export const userProfessionRelations = relations(user, ({ many }) => ({
	professions: many(professionsToUsers),
}));

export const professionsToUsersRelations = relations(professionsToUsers, ({ one }) => ({
	user: one(user, {
		fields: [professionsToUsers.userId],
		references: [user.id],
	}),
	profession: one(profession, {
		fields: [professionsToUsers.professionId],
		references: [profession.id],
	}),
}));
