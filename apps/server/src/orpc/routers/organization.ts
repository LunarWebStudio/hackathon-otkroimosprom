import { db } from "@lunarweb/database";
import { organizations, user } from "@lunarweb/database/schema";
import { protectedProcedure, roleProcedure } from "../orpc";
import {
	organizationRequestStatusSchema,
	OrganizationSchema,
} from "@lunarweb/shared/schemas";
import z from "zod/v4";
import { and, desc, eq, isNull } from "drizzle-orm";

export const organizationRouter = {
	get: roleProcedure(["ADMIN"])
		.input(
			z.object({
				showAll: z.boolean().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			return await db.query.organizations.findMany({
				orderBy: desc(organizations.createdAt),
				where: and(
					isNull(organizations.deletedAt),
					eq(organizations.status, "APPROVED").if(
						!input.showAll && context.session.user.role !== "ADMIN",
					),
				),
			});
		}),
	getOne: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			return await db.query.organizations.findFirst({
				where: eq(organizations.id, input.id),
			});
		}),
	create: protectedProcedure
		.input(OrganizationSchema)
		.handler(async ({ input, context }) => {
			await db.insert(organizations).values({
				...input,
				managerId: context.session.user.id,
			});
		}),
	updateStatus: roleProcedure(["ADMIN"])
		.input(
			z.object({
				id: z.string(),
				status: organizationRequestStatusSchema,
			}),
		)
		.handler(async ({ input, context }) => {
			await db.transaction(async (trx) => {
				const [org] = await trx
					.update(organizations)
					.set({
						status: input.status,
					})
					.where(eq(organizations.id, input.id))
					.returning();
				if (input.status === "APPROVED") {
					await trx
						.update(user)
						.set({
							organizationId: org.id,
							role:
								org.managerId !== context.session.user.id
									? "COMPANY_MANAGER"
									: undefined,
						})
						.where(eq(user.id, org.managerId));
				}
			});
		}),
};
