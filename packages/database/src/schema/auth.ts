import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
	type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { relations } from "drizzle-orm";
import { genderEnum } from "./utils";

export const userRolesEnum = pgEnum("user_roles", [
	"USER",
	"ADMIN",
	"COMPANY_MANAGER",
	"HR",
]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	phoneNumber: text("phone_number"),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	organizationId: varchar("organization_id").references(
		(): AnyPgColumn => organizations.id,
	),
	universityName: varchar("university_name"),
	gender: genderEnum(),
	role: userRolesEnum().notNull(),
	deletedAt: timestamp("deleted_at"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [user.organizationId],
		references: [organizations.id],
		relationName: "organizationToUser",
	}),
	organizations: many(organizations, {
		relationName: "organizationsToUser",
	}),
}));

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});
