import { pgEnum, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const organizationRequestsStatus = pgEnum(
	"organization_requests_status",
	["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
);

export const commonFields = {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	serial: serial("serial").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
};
