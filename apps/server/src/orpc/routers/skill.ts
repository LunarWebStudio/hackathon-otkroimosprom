import { db } from "@lunarweb/database";
import { publicProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { desc, eq, isNull } from "drizzle-orm";
import { skills } from "@lunarweb/database/schema";
import { z } from "zod/v4";
import { SkillSchema } from "@lunarweb/shared/schemas";

export const skillsRouter = {
	getAll: publicProcedure.handler(async () => {
		return ServeCached(
			["skills"],
			DEFAULT_TTL,
			async () =>
				await db.query.skills.findMany({
					where: isNull(skills.deletedAt),
					orderBy: desc(skills.createdAt),
				}),
		);
	}),
	create: roleProcedure(["ADMIN"])
		.input(SkillSchema)
		.handler(async ({ input }) => {
			await db.insert(skills).values(input);

			await InvalidateCached(["skills"]);
		}),
	update: roleProcedure(["ADMIN"])
		.input(
			SkillSchema.extend({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(skills)
				.set({
					name: input.name,
				})
				.where(eq(skills.id, input.id));

			await InvalidateCached(["skills"]);
		}),
	delete: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(skills)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(skills.id, input.id));
			await InvalidateCached(["skills"]);
		}),
};
