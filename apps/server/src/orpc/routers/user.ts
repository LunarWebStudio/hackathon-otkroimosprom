import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { publicProcedure, roleProcedure } from "../orpc";
import { db } from "@lunarweb/database";
import { desc, eq } from "drizzle-orm";
import { user } from "@lunarweb/database/schema";
import { UserSchema } from "@lunarweb/shared/schemas";
import z from "zod/v4";

export const userRouter = {
	session: {
		get: publicProcedure.handler(async ({ context }) => context.session),
	},
	get: roleProcedure(["ADMIN"]).handler(async () =>
		ServeCached(["users"], DEFAULT_TTL, async () => {
			return await db.query.user.findMany({
				orderBy: desc(user.createdAt),
				columns: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					role: true,
				},
			});
		}),
	),
	update: roleProcedure(["ADMIN"])
		.input(
			UserSchema.extend({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(user)
				.set({
					name: input.name,
					role: input.role,
				})
				.where(eq(user.id, input.id));

			await InvalidateCached(["users"]);
		}),
};
