import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";

export const universities = pg.pgTable("universities", {
	...commonFields,
	name: pg.varchar({ length: 255 }).notNull(),
});
