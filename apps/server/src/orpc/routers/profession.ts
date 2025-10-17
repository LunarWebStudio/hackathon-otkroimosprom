import { db } from "@lunarweb/database";
import { protectedProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { and, desc, eq, isNull } from "drizzle-orm";
import { profession } from "@lunarweb/database/schema";
import { z } from "zod";

export const professionsRouter = {
	getAll: protectedProcedure.handler(async () => {
		return ServeCached(
			["professions", "all"],
			DEFAULT_TTL,
			async () =>
				await db.query.profession.findMany({
					where: isNull(profession.deletedAt),
					orderBy: desc(profession.createdAt),
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
			await db.insert(profession).values(input);
			await InvalidateCached(["professions"]);
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
				.update(profession)
				.set({
					name: input.name, 
				})
				.where(eq(profession.id, input.id));

			await InvalidateCached(["professions"]);
		}),

	delete: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(profession)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(profession.id, input.id));

			await InvalidateCached(["professions"]);
		}),
};
