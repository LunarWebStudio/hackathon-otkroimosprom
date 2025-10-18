import { publicProcedure, roleProcedure } from "../orpc";
import { db } from "@lunarweb/database";
import { and, desc, eq, isNull } from "drizzle-orm";
import { user } from "@lunarweb/database/schema";
import { EmployeeSchema, UserSchema } from "@lunarweb/shared/schemas";
import z from "zod/v4";
import { auth } from "../../auth/auth";
import { ORPCError } from "@orpc/server";

export const userRouter = {
	session: {
		get: publicProcedure.handler(async ({ context }) => context.session),
	},
	get: roleProcedure(["ADMIN", "COMPANY_MANAGER"]).handler(
		async ({ context }) =>
			await db.query.user.findMany({
				orderBy: desc(user.createdAt),
				columns: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					role: true,
				},
				where: and(
					eq(
						user.organizationId,
						context.session.user.organizationId ?? "INVALID",
					).if(context.session.user.role === "COMPANY_MANAGER"),
					isNull(user.deletedAt),
				),
			}),
	),
	delete: roleProcedure(["ADMIN", "COMPANY_MANAGER"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const emailUser = await db.query.user.findFirst({
				columns: {
					email: true,
				},
				where: and(
					eq(user.id, input.id),
					eq(
						user.organizationId,
						context.session.user.organizationId ?? "INVALID",
					),
				),
			});

			if (!emailUser) {
				throw new ORPCError("NOT_FOUND");
			}

			await db
				.update(user)
				.set({
					deletedAt: new Date(),
					email: `deleted-${emailUser.email}-${Bun.randomUUIDv7()}`,
				})
				.where(
					and(
						eq(user.id, input.id),
						eq(
							user.organizationId,
							context.session.user.organizationId ?? "INVALID",
						),
					),
				);
		}),
	update: roleProcedure(["ADMIN"])
		.input(
			UserSchema.extend({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await db
				.update(user)
				.set({
					name: input.name,
					role: input.role,
				})
				.where(eq(user.id, input.id));
		}),
	create: roleProcedure(["COMPANY_MANAGER"])
		.input(EmployeeSchema)
		.handler(async ({ context, input }) => {
			const usr = await auth.api.signUpEmail({
				body: {
					email: input.email,
					name: input.name,
					password: input.password,
				},
			});

			await db
				.update(user)
				.set({
					role: input.role,
					organizationId: context.session.user.organizationId,
				})
				.where(eq(user.id, usr.user.id));
		}),
};
