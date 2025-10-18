import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { requests } from "./request";
import { relations } from "drizzle-orm";

export const responses = pg.pgTable("responses", {
	...commonFields,
	requestId: pg
		.varchar("request_id", { length: 255 })
		.notNull()
		.references(() => requests.id),
	text: pg.text("text").notNull(),
});

export const responsesRelation = relations(responses, ({ one }) => ({
	request: one(requests, {
		fields: [responses.requestId],
		references: [requests.id],
	}),
}));
