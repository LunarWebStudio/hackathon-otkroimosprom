import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { user } from "./auth";
import { relations } from "drizzle-orm";

const baseOrganizationFields = {
	name: pg.varchar({ length: 255 }).notNull(),
	inn: pg.varchar({ length: 255 }),
	orgn: pg.varchar({ length: 255 }),
	kpp: pg.varchar({ length: 255 }),
	address: pg.text(),
	lawAddress: pg.text(),
	contacts: pg.text(),
};

export const organizationRequestsStatus = pg.pgEnum(
	"organization_requests_status",
	["PENDING", "APPROVED", "REJECTED"],
);

export const organizationRequests = pg.pgTable("organization_requests", {
	...commonFields,
	...baseOrganizationFields,

	status: organizationRequestsStatus().notNull().default("PENDING"),

	createdById: pg
		.varchar({ length: 255 })
		.notNull()
		.references(() => user.id),
});

export const organizations = pg.pgTable("organizations", {
	...commonFields,
	...baseOrganizationFields,
	managerId: pg
		.varchar({ length: 255 })
		.notNull()
		.references(() => user.id),
});

// export const organizationRelations = relations(organizations, ({ one }) => ({
// 	manager: one(user, {
// 		fields: [organizations.managerId],
// 		references: [user.id],
// 	}),
// }));
