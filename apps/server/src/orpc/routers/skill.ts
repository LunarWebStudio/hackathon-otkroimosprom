import { db } from "@lunarweb/database";
import { protectedProcedure, publicProcedure, roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { and, desc, eq, isNull } from "drizzle-orm";
import { skills } from "@lunarweb/database/schema";
import { z } from "zod";

export const skillsRouter = {
    getAll: protectedProcedure.handler(async () => {
        return ServeCached(["skills", "all"], DEFAULT_TTL, async () => await db.query.skill.findMany({
            where: isNull(skills.deletedAt),
            orderBy: desc(skills.createdAt)
        }))
    }),
    create: roleProcedure(["ADMIN"])
    .input(
        z.object({
            name: z.string()
        })
    )
        .handler(async ({input}) => {
            await db.insert(skills).values(input)

            await InvalidateCached(["skills"])
        }),
    update: roleProcedure(["ADMIN"])
        .input(
            z.object({
                id: z.string(),
                name: z.string()
            })
        )
        .handler(async ({input}) => {
            await db.update(skills).set({
                name: input.id
            }).where(eq(skills.id, input.id))

            await InvalidateCached(["skills"])
        }),

    delete: roleProcedure(["ADMIN"])
        .input(
            z.object({
                id: z.string()
            })
        )
        .handler(async ({input}) => {
            await db.update(skills).set({
                deletedAt: new Date()
            }).where(eq(skills.id, input.id))
        })
}