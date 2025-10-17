import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { files } from "./file";
import { genderEnum, user } from "./auth";
import { specialties } from "./speciality";

export const resumes = pg.pgTable("resumes", {
	...commonFields,
	title: pg.varchar({ length: 255 }).notNull(),
	photoId: pg.varchar({ length: 255 }).references(() => files.id),
	birthDate: pg.timestamp(),
	gender: genderEnum(),
	phoneNumber: pg.varchar({ length: 255 }),
	email: pg.varchar({ length: 255 }),
	skillIds: pg.varchar({ length: 255 }).notNull().array().notNull(),
	experience: pg.varchar({ length: 255 }),
	courses: pg.varchar({ length: 255 }).notNull().array().notNull(),
	description: pg.varchar({ length: 255 }),
	fileId: pg.varchar({ length: 255 }).references(() => files.id),
	citizenship: pg.varchar({ length: 255 }),

	specialtyId: pg
		.varchar({ length: 255 })
		.references(() => specialties.id)
		.notNull(),
	userId: pg.varchar({ length: 255 }).references(() => user.id),
});
