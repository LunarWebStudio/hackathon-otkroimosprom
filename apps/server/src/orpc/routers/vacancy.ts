import { db } from "@lunarweb/database";
import { publicProcedure, roleProcedure } from "../orpc";
import { VacancySchema } from "@lunarweb/shared/schemas";
import { vacancies } from "../../../../../packages/database/src/schema/vacancy";
import z from "zod/v4";
import { eq } from "drizzle-orm";
export { vacancies } from "@lunarweb/database/schema";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";

export const vacancyRouter = {
	create: roleProcedure(["HR"])
		.input(VacancySchema)
		.handler(async ({ input }) => {
			await db.insert(vacancies).values(input);
		}),
	update: roleProcedure(["HR"])
		.input(VacancySchema.extend({ id: z.string() }))
		.handler(async ({ input }) => {
			await db.update(vacancies).set(input).where(eq(vacancies.id, input.id));
		}),
	getById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return ServeCached(
				["vacancies", input.id],
				DEFAULT_TTL,
				async () =>
					await db.query.vacancies.findFirst({
						where: eq(vacancies.id, input.id),
					}),
			);
		}),
};
