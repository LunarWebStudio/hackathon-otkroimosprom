import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { vacancies } from "./vacancy";

export const organizationRequestsStatus = pg.pgEnum(
	"organization_requests_status",
	["PENDING", "APPROVED", "REJECTED"],
);

export const organizations = pg.pgTable("organizations", {
	...commonFields,
	name: pg.varchar({ length: 255 }).notNull(),
	inn: pg.varchar({ length: 255 }),
	orgn: pg.varchar({ length: 255 }),
	kpp: pg.varchar({ length: 255 }),
	address: pg.text(),
	contacts: pg.text(),
	status: organizationRequestsStatus().notNull().default("PENDING"),
	managerId: pg
		.varchar({ length: 255 })
		.notNull()
		.references(() => user.id),
});

export const organizationRelations = relations(
	organizations,
	({ one, many }) => ({
		manager: one(user, {
			fields: [organizations.managerId],
			references: [user.id],
			relationName: "organizationToUser",
		}),
		users: many(user, {
			relationName: "organizationsToUser",
		}),
		vacancies: many(vacancies, {
			relationName: "organizationsToVacancies",
		}),
	}),
);
