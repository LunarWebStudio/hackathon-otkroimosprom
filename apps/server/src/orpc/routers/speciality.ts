import { db } from "@lunarweb/database";
import { publicProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { desc, eq, isNull } from "drizzle-orm";
import { specialties } from "@lunarweb/database/schema";
import { z } from "zod";

export const specialitiesRouter = {
	getAll: publicProcedure.handler(async () => {
		return ServeCached(
			["specialties", "all"],
			DEFAULT_TTL,
			async () =>
				await db.query.specialties.findMany({
					where: isNull(specialties.deletedAt),
					orderBy: desc(specialties.createdAt),
				}),
		);
	}),

	create: roleProcedure(["ADMIN"])
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db.insert(specialties).values(input);
			await InvalidateCached(["specialties"]);
		}),

	update: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(specialties)
				.set({
					name: input.name,
				})
				.where(eq(specialties.id, input.id));

			await InvalidateCached(["specialties"]);
		}),

	delete: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(specialties)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(specialties.id, input.id));

			await InvalidateCached(["specialties"]);
		}),
};
