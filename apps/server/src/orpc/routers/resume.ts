import { protectedProcedure, publicProcedure, roleProcedure } from "../orpc";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { resumes, skillsToResumes } from "@lunarweb/database/schema";
import { db } from "@lunarweb/database";
import { ResumeSchema } from "@lunarweb/shared/schemas";
import z from "zod/v4";

export const resumeRouter = {
	getAll: roleProcedure(["ADMIN", "HR", "USER"]).handler(
		async ({ context }) => {
			const role = context.session.user.role;

			if (role === "USER") {
				return ServeCached(
					["resumes", "all"],
					DEFAULT_TTL,
					async () =>
						await db.query.resumes.findMany({
							where: and(
								isNull(resumes.deletedAt),
								eq(resumes.userId, context.session.user.id),
							),
							orderBy: desc(resumes.createdAt),
						}),
				);
			}

			return ServeCached(
				["resumes", "all"],
				DEFAULT_TTL,
				async () =>
					await db.query.resumes.findMany({
						where: isNull(resumes.deletedAt),
						orderBy: desc(resumes.createdAt),
					}),
			);
		},
	),
	getById: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return ServeCached(
				["resumes", input.id],
				DEFAULT_TTL,
				async () =>
					await db.query.resumes.findFirst({
						where: eq(resumes.id, input.id),
					}),
			);
		}),
	getMyResumes: protectedProcedure.handler(({ context }) => {
		return ServeCached(
			["resumes", "my", context.session.user.id],
			DEFAULT_TTL,
			async () =>
				await db.query.resumes.findMany({
					where: and(
						eq(resumes.userId, context.session.user.id),
						isNull(resumes.deletedAt),
					),
					orderBy: desc(resumes.createdAt),
				}),
		);
	}),
	create: protectedProcedure
		.input(ResumeSchema)
		.handler(async ({ context, input }) => {
			await db.insert(resumes).values({
				...input,
				specialtyId: input.specialtyId,
				userId: context.session.user.id,
			});

			await InvalidateCached(["resumes"]);
		}),
	update: protectedProcedure
		.input(ResumeSchema.extend({ id: z.string() }))
		.handler(async ({ input }) => {
			await db.update(resumes).set(input).where(eq(resumes.id, input.id));

			await InvalidateCached(["resumes"]);
		}),
	findBySkills: roleProcedure(["HR"])
		.input(ResumeSchema)
		.handler(async ({ input }) => {
			return ServeCached(
				["resumes", JSON.stringify(input.skillIds)],
				DEFAULT_TTL,
				async () =>
					await db
						.select({
							id: resumes.id,
							title: resumes.title,
						})
						.from(resumes)
						.innerJoin(
							skillsToResumes,
							eq(resumes.id, skillsToResumes.resumeId),
						)
						.where(inArray(skillsToResumes.skillId, input.skillIds))
						.groupBy(resumes.id),
				// .having(
				// 	sql`COUNT(DISTINCT ${skillsToResumes.skillId}) = ${input.skillIds.length}`,
				// )
			);
		}),
	findBySpeciality: roleProcedure(["HR"])
		.input(ResumeSchema)
		.handler(async ({ input }) => {
			return ServeCached(
				["resumes", "speciality", input.specialtyId],
				DEFAULT_TTL,
				async () =>
					await db.query.resumes.findMany({
						where: and(
							isNull(resumes.deletedAt),
							eq(resumes.specialtyId, input.specialtyId),
						),
					}),
			);
		}),
};
