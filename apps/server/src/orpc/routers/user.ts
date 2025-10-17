import { db } from "@lunarweb/database";
import { publicProcedure } from "../orpc";
import { user } from "@lunarweb/database/schema";
import { ServeCached, DEFAULT_TTL, redis } from "@lunarweb/redis";

export const userRouter = {
	session: {
		get: publicProcedure.handler(async ({ context }) => context.session),
	},
};
