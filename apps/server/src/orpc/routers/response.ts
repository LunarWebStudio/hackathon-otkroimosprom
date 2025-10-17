import { db } from "@lunarweb/database";
import { roleProcedure } from "../orpc";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "@lunarweb/redis";
import { requests, responses } from "@lunarweb/database/schema";
import { ResponseSchema } from "@lunarweb/shared/schemas";
import z from "zod/v4";
import { desc, eq } from "drizzle-orm";

export const responseRouter = {
	create: roleProcedure(["HR", "USER"])
		.input(ResponseSchema)
		.handler(async ({ input }) => {
			await db.transaction(async (trx) => {
				const [createdResponse] = await trx
					.insert(responses)
					.values({
						requestId: input.requestId,
						text: input.text,
					})
					.returning();

				await trx
					.update(requests)
					.set({
						status: input.status,
					})
					.where(eq(requests.id, createdResponse.requestId));
			});

			await InvalidateCached(["responses"]);
			await InvalidateCached(["requests"]);
		}),
	getAll: roleProcedure(["HR", "USER"]).handler(async ({ context }) => {
		const role = context.session.user.role;
		if (role === "HR") {
			return ServeCached(
				["responses", "all"],
				DEFAULT_TTL,
				async () =>
					await db.query.responses.findMany({
						orderBy: desc(responses.createdAt),
					}),
			);
		}

		if (role === "USER") {
			return ServeCached(
				["responses", "all"],
				DEFAULT_TTL,
				async () =>
					await db.query.responses.findMany({
						where: eq(responses.requestId, context.session.user.id),
						orderBy: desc(responses.createdAt),
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
				["responses", input.id],
				DEFAULT_TTL,
				async () =>
					await db.query.responses.findFirst({
						where: eq(responses.id, input.id),
					}),
			);
		}),
};
