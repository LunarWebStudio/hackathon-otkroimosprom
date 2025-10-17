import { db } from "@lunarweb/database";
import { protectedProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { desc, eq, isNotNull, and, isNull } from "drizzle-orm";
import { requests } from "@lunarweb/database/schema";
import { id } from "zod/v4/locales";
import z from "zod/v4";
import { RequestSchema } from "@lunarweb/shared/schemas";

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
					["requests", user.organisationId!, input.status ?? "ALL"],
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

	getById: roleProcedure(["HR", "USER"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return ServeCached(
				["requests", input.id],
				DEFAULT_TTL,
				async () =>
					await db.query.requests.findFirst({
						where: isNotNull(requests.id),
					}),
			);
		}),

	create: roleProcedure(["HR", "USER"])
		.input(RequestSchema)
		.handler(async ({ input, context }) => {
			const role = context.session.user.role;
			if (role === "HR") {
				await db.insert(requests).values({
					vacancyId: input.vacancyId,
				});
			} else if (role === "USER") {
				await db.insert(requests).values({
					resumeId: input.resumeId,
				});
			}

			await InvalidateCached(["requests"]);
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
