import { db } from "@lunarweb/database";
import { publicProcedure, roleProcedure } from "../orpc";
import {
	organizationRequestStatusSchema,
	VacancySchema,
	VacancyTypeSchema,
} from "@lunarweb/shared/schemas";
import { vacancies } from "../../../../../packages/database/src/schema/vacancy";
import z from "zod/v4";
import { eq, isNull, and, desc } from "drizzle-orm";
export { vacancies } from "@lunarweb/database/schema";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { ORPCError } from "@orpc/server";

export const vacanciesRouter = {
	create: roleProcedure(["HR", "COMPANY_MANAGER"])
		.input(VacancySchema)
		.handler(async ({ input, context }) => {
			if (!context.session.user.organizationId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "Вы не стостоите в компании",
				});
			}

			await db.insert(vacancies).values({
				...input,
				organizationId: context.session.user.organizationId,
			});
			await InvalidateCached(["vacancies"]);
		}),
	update: roleProcedure(["HR", "COMPANY_MANAGER"])
		.input(VacancySchema.extend({ id: z.string() }))
		.handler(async ({ input }) => {
			await db.update(vacancies).set(input).where(eq(vacancies.id, input.id));
			await InvalidateCached(["vacancies"]);
		}),
	getOne: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return await db.query.vacancies.findFirst({
				where: eq(vacancies.id, input.id),
			});
		}),
	getAll: roleProcedure(["ADMIN", "HR", "COMPANY_MANAGER"])
		.input(
			z
				.object({
					type: VacancyTypeSchema.nullish(),
				})
				.nullish(),
		)
		.handler(async ({ input, context }) => {
			return await db.query.vacancies.findMany({
				where: and(
					isNull(vacancies.deletedAt),
					eq(vacancies.type, input?.type ?? "JOB").if(!!input?.type),
					eq(
						vacancies.organizationId,
						context.session.user.organizationId ?? "INVALID",
					).if(context.session.user.role !== "ADMIN"),
				),
				with: {
					organization: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: desc(vacancies.createdAt),
			});
		}),
	updateStatus: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
				status: organizationRequestStatusSchema,
			}),
		)
		.handler(async ({ input }) => {
			const ret = await db
				.update(vacancies)
				.set({
					status: input.status,
				})
				.where(eq(vacancies.id, input.id))
				.returning();
			console.log({ ret });
		}),
	delete: roleProcedure(["HR", "COMPANY_MANAGER"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			if (!context.session.user.organizationId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "Вы не стостоите в компании",
				});
			}

			await db
				.update(vacancies)
				.set({ deletedAt: new Date() })
				.where(
					and(
						eq(vacancies.id, input.id),
						eq(
							vacancies.organizationId,
							context.session.user.organizationId ?? "INVALID",
						),
					),
				);
			await InvalidateCached(["vacancies"]);
		}),
};
