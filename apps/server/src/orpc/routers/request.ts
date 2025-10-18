import { db } from "@lunarweb/database";
import { protectedProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { desc, eq, isNotNull, and, isNull } from "drizzle-orm";
import { requests, resumes, vacancies } from "@lunarweb/database/schema";
import { id } from "zod/v4/locales";
import z from "zod/v4";
import {
	organizationRequestStatusSchema,
	RequestSchema,
} from "@lunarweb/shared/schemas";
import { ORPCError } from "@orpc/server";

export const requestsRouter = {
	getAll: roleProcedure(["HR", "USER"])
		.input(
			z.object({
				status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const user = context.session.user;
			const statusCondition = input.status
				? eq(requests.status, input.status)
				: undefined;

			if (user.role === "HR") {
				return ServeCached(
					["requests", user.organizationId!, input.status ?? "ALL"],
					DEFAULT_TTL,
					async () =>
						await db.query.requests.findMany({
							where: and(isNotNull(requests.vacancyId), statusCondition),
							orderBy: desc(requests.createdAt),
						}),
				);
			}

			if (user.role === "USER") {
				return ServeCached(
					["requests", user.id, input.status ?? "ALL"],
					DEFAULT_TTL,
					async () =>
						await db.query.requests.findMany({
							where: and(isNotNull(requests.resumeId), statusCondition),
							orderBy: desc(requests.createdAt),
						}),
				);
			}
		}),
	getCompany: roleProcedure(["HR", "COMPANY_MANAGER"])
		.input(
			z.object({
				vacancyId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			return await db.query.requests.findMany({
				orderBy: desc(requests.createdAt),
				where: and(
					eq(
						requests.organizationId,
						context.session.user.organizationId ?? "INVALID",
					),
					eq(requests.vacancyId, input.vacancyId),
				),
				with: {
					vacancy: true,
					organization: true,
					resume: true,
				},
			});
		}),
	getStudent: roleProcedure(["USER"]).handler(async ({ context }) => {
		return await db.query.requests.findMany({
			orderBy: desc(requests.createdAt),
			where: eq(requests.userId, context.session.user.id ?? "INVALID"),
			with: {
				vacancy: true,
				organization: true,
			},
		});
	}),
	updateStatus: roleProcedure(["HR", "COMPANY_MANAGER"])
		.input(
			z.object({
				id: z.string(),
				status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
			}),
		)
		.handler(async ({ input, context }) => {
			await db
				.update(requests)
				.set({
					status: input.status,
				})
				.where(
					and(
						eq(requests.id, input.id),
						eq(
							requests.organizationId,
							context.session.user.organizationId ?? "INVALID",
						),
					),
				)
				.returning();
		}),
	create: roleProcedure(["HR", "USER"])
		.input(RequestSchema)
		.handler(async ({ input, context }) => {
			const latestResume = await db.query.resumes.findFirst({
				where: and(eq(resumes.userId, context.session.user.id)),
			});

			if (!latestResume) {
				throw new ORPCError("BAD_REQUEST", {
					message: "У вас нет резюме",
				});
			}

			const vacancy = await db.query.vacancies.findFirst({
				where: eq(vacancies.id, input.vacancyId),

				columns: {
					organizationId: true,
				},
			});

			if (!vacancy) {
				throw new ORPCError("NOT_FOUND", {
					message: "Вакансия не найдена",
				});
			}

			await db.insert(requests).values({
				vacancyId: input.vacancyId,
				resumeId: latestResume.id,
				userId: context.session.user.id,
				organizationId: vacancy.organizationId,
			});
		}),
	delete: roleProcedure(["HR", "USER"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(requests)
				.set({ deletedAt: new Date() })
				.where(eq(requests.id, input.id));
			await InvalidateCached(["requests"]);
		}),
	getRequestsByVacancy: roleProcedure(["HR"])
		.input(
			z.object({
				vacancyId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return ServeCached(
				["requests", "vacancy", input.vacancyId],
				DEFAULT_TTL,
				async () =>
					await db.query.requests.findMany({
						where: and(
							eq(requests.vacancyId, input.vacancyId),
							isNull(requests.deletedAt),
						),
						orderBy: desc(requests.createdAt),
					}),
			);
		}),
};
