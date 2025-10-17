import { db } from "@lunarweb/database";
import { protectedProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { and, desc, eq, isNull } from "drizzle-orm";
import { speciality } from "@lunarweb/database/schema";
import { z } from "zod";

export const specialitysRouter = {
	getAll: protectedProcedure.handler(async () => {
		return ServeCached(
			["specialitys", "all"],
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
			await InvalidateCached(["specialitys"]);
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

			await InvalidateCached(["specialitys"]);
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

			await InvalidateCached(["specialitys"]);
		}),
};
