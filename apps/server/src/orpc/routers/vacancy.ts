import { db } from "@lunarweb/database";
import { publicProcedure, roleProcedure } from "../orpc";
import { VacancySchema } from "@lunarweb/shared/schemas";
import { vacancies } from "../../../../../packages/database/src/schema/vacancy";
import z from "zod/v4";
import { eq, isNull, and, desc } from "drizzle-orm";
export { vacancies } from "@lunarweb/database/schema";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";

export const vacanciesRouter = {
	create: roleProcedure(["HR"])
		.input(VacancySchema)
		.handler(async ({ input }) => {
			await db.insert(vacancies).values(input);
			await InvalidateCached(["vacancies"]);
		}),
	update: roleProcedure(["HR"])
		.input(VacancySchema.extend({ id: z.string() }))
		.handler(async ({ input }) => {
			await db.update(vacancies).set(input).where(eq(vacancies.id, input.id));
			await InvalidateCached(["vacancies"]);
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
	getAll: publicProcedure.handler(async () => {
		return ServeCached(
			["vacancies", "all"],
			DEFAULT_TTL,
			async () =>
				await db.query.vacancies.findMany({
					where: isNull(vacancies.deletedAt),
					orderBy: desc(vacancies.createdAt),
				}),
		);
	}),
	delete: roleProcedure(["HR"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(vacancies)
				.set({ deletedAt: new Date() })
				.where(eq(vacancies.id, input.id));
			await InvalidateCached(["vacancies"]);
		}),
	findByCompany: publicProcedure
		.input(
			z.object({
				companyId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return ServeCached(
				["vacancies", "company", input.companyId],
				DEFAULT_TTL,
				async () =>
					await db.query.vacancies.findMany({
						where: and(
							eq(vacancies.companyId, input.companyId),
							isNull(vacancies.deletedAt),
						),
						orderBy: desc(vacancies.createdAt),
					}),
			);
		}),
	findByType: publicProcedure
		.input(
			z.object({
				type: z.enum(["JOB", "INTERNSHIP"]),
			}),
		)
		.handler(async ({ input }) => {
			return ServeCached(
				["vacancies", "type", input.type],
				DEFAULT_TTL,
				async () =>
					await db.query.vacancies.findMany({
						where: and(
							eq(vacancies.type, input.type),
							isNull(vacancies.deletedAt),
						),
						orderBy: desc(vacancies.createdAt),
					}),
			);
		}),
};
