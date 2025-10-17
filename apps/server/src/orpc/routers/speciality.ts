import { db } from "@lunarweb/database";
import { protectedProcedure, publicProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { and, desc, eq, isNull } from "drizzle-orm";
import { speciality } from "@lunarweb/database/schema";
import { z } from "zod";

export const specialitiesRouter = {
	getAll: publicProcedure.handler(async () => {
		return ServeCached(
			["specialties", "all"],
			DEFAULT_TTL,
			async () =>
				await db.query.speciality.findMany({
					where: isNull(speciality.deletedAt),
					orderBy: desc(speciality.createdAt),
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
			await db.insert(speciality).values(input);
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
				.update(speciality)
				.set({
					name: input.name, 
				})
				.where(eq(speciality.id, input.id));

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
				.update(speciality)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(speciality.id, input.id));

			await InvalidateCached(["specialties"]);
		}),
};
