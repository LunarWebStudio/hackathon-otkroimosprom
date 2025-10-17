import { db } from "@lunarweb/database";
import {
	organizationRequests,
	organizations,
	user,
} from "@lunarweb/database/schema";
import { roleProcedure } from "../orpc";
import {
	organizationRequestStatusSchema,
	OrganizationSchema,
} from "@lunarweb/shared/schemas";
import z from "zod/v4";
import { desc, eq, inArray } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { organization } from "better-auth/plugins";

export const organizationRouter = {
	requests: {
		get: roleProcedure(["ADMIN"])
			.input(
				z.object({
					statuses: organizationRequestStatusSchema.array(),
				}),
			)
			.handler(async ({ input }) =>
				ServeCached(
					["organization-requests", JSON.stringify(input)],
					DEFAULT_TTL,
					async () => {
						return await db.query.organizationRequests.findMany({
							where: inArray(organizationRequests.status, input.statuses),
							orderBy: desc(organizationRequests.createdAt),
						});
					},
				),
			),
		create: roleProcedure(["USER"])
			.input(OrganizationSchema)
			.handler(async ({ context, input }) => {
				await db.insert(organizationRequests).values({
					...input,
					createdById: context.session.user.id,
				});
				await InvalidateCached(["organization-requests"]);
			}),
		updateStatus: roleProcedure(["ADMIN"])
			.input(
				z.object({
					id: z.string(),
					status: organizationRequestStatusSchema,
				}),
			)
			.handler(async ({ context, input }) => {
				const organizationData = await db.query.organizationRequests.findFirst({
					where: eq(organizationRequests.id, input.id),
				});

				if (!organizationData) {
					throw new ORPCError("NOT_FOUND");
				}

				await db.transaction(async (trx) => {
					await trx
						.update(organizationRequests)
						.set({
							status: input.status,
						})
						.where(eq(organizationRequests.id, input.id));
				});

				if (input.status === "APPROVED") {
					const [{ id }] = await db
						.insert(organizations)
						.values({
							...organizationData,
							id: Bun.randomUUIDv7(),
							managerId: context.session.user.id,
						})
						.returning();
					await db.update(user).set({
						role: "HR",
						companyId: id,
					});
				}
				await InvalidateCached(["organization-requests"]);
			}),
	},
};
