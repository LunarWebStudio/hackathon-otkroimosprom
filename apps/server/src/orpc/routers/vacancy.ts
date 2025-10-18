import { db } from "@lunarweb/database";
import {
	organizationRequestStatusSchema,
	VacancySchema,
	VacancyTypeSchema,
} from "@lunarweb/shared/schemas";
import { and, desc, eq, gte, isNull, lte } from "drizzle-orm";
import z from "zod/v4";
import { vacancies } from "../../../../../packages/database/src/schema/vacancy";
import { publicProcedure, roleProcedure } from "../orpc";

export { vacancies } from "@lunarweb/database/schema";
import { resumes } from "@lunarweb/database/schema";
import { InvalidateCached } from "@lunarweb/redis";
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
				with: {
					organization: true,
					specialty: true,
				},
			});
		}),
	getAll: roleProcedure(["ADMIN", "HR", "COMPANY_MANAGER"])
		.input(
			z
				.object({
					type: VacancyTypeSchema.nullish().default("JOB"),
				})
				.nullish()
				.default({
					type: "JOB",
				}),
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
	/*
	 * Ну по хорошему конечно тут надо КРУТЕЙШИЙ SQL запрос
	 * */
	getByCompatabilityRating: publicProcedure.handler(
		async ({ context, input }) => {
			const v = await db.query.vacancies.findMany({
				orderBy: desc(vacancies.createdAt),
				where: and(
					isNull(vacancies.deletedAt),
					eq(vacancies.status, "APPROVED"),
					gte(vacancies.expiresAt, new Date()),
				),
				with: {
					organization: {
						columns: {
							id: true,
							name: true,
						},
					},
					specialty: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			});
			const vacanciesWithRating = v.map((v) => ({
				...v,
				compatabilityRating: 0,
			}));
			if (!context.session) {
				return vacanciesWithRating;
			}
			const latestResume = await db.query.resumes.findFirst({
				where: and(eq(resumes.userId, context.session.user.id)),
			});
			if (!latestResume) {
				return vacanciesWithRating;
			}
			const vacanciesWithActualRating = v.map((v) => {
				const resumeSkillIdsSet = new Set(latestResume.skillIds);
				const vacancySkillIdsSet = new Set(v.skillIds);
				const intersection = new Set(
					[...resumeSkillIdsSet].filter((x) => vacancySkillIdsSet.has(x)),
				);
				const union = new Set([...resumeSkillIdsSet, ...vacancySkillIdsSet]);
				const percent = intersection.size / union.size;
				return {
					...v,
					compatabilityRating: percent,
				};
			});
			return vacanciesWithActualRating.sort(
				(a, b) => b.compatabilityRating - a.compatabilityRating,
			);
		},
	),
};
