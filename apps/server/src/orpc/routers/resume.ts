import { protectedProcedure, publicProcedure, roleProcedure } from "../orpc";
import { z } from "zod";
import { and, desc, eq, isNull } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { resumes } from "@lunarweb/database/schema";
import { db } from "@lunarweb/database";

export const ResumeSchema = z.object({
	title: z.string().min(1),
	photoId: z.string().optional().nullable(),
	birthDate: z.date().optional().nullable(),
	gender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	email: z.string().email().optional().nullable(),
	skillIds: z.array(z.string()).min(1),
	experience: z.string().optional().nullable(),
	courses: z.array(z.string()).min(1),
	description: z.string().optional().nullable(),
	fileId: z.string().optional().nullable(),
	citizenship: z.string().optional().nullable(),
	specialtyId: z.string().optional().nullable(),
});

export const resumeRouter = {
    getAll : roleProcedure(["ADMIN", "HR"]).handler(async () => {
        return ServeCached(["resumes", "all"], DEFAULT_TTL, async () => await db.query.resumes.findMany({
            where: isNull(resumes.deletedAt),
            orderBy: desc(resumes.createdAt)
        }))
    }),
    getById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .handler(async ({input}) => {
            return ServeCached(["resumes", input.id], DEFAULT_TTL, async () => await db.query.resumes.findFirst({
                where: eq(resumes.id, input.id)
            }))
        }),
    getMyResumes: protectedProcedure.handler(({context}) => {
        return ServeCached(["resumes", "my", context.session.user.id], DEFAULT_TTL, async () => await db.query.resumes.findMany({
            where: and(eq(resumes.userId, context.session.user.id), isNull(resumes.deletedAt)),
            orderBy: desc(resumes.createdAt)
        }) )
    }),
    create: protectedProcedure
    .input(ResumeSchema)
        .handler(async ({context, input}) => {
            await db.insert(resumes).values({
                ...input,
                userId: context.session.user.id
            })

            await InvalidateCached(["resumes"])
        }),
    update: protectedProcedure
        .input(ResumeSchema)
        .handler(async ({input, context}) => {
            await db.update(resumes).set({
                ...input
            }).where(eq(resumes.userId, context.session.user.id))

            await InvalidateCached(["resumes"])
        })
};
