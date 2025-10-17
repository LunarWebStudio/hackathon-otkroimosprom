import { db } from "@lunarweb/database";
import * as schema from "@lunarweb/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { UserRole } from "@lunarweb/shared/types";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	user: {
		additionalFields: {
			companyId: {
				type: "string",
				required: false,
				input: false,
				defaultValue: null,
			},
			gender: {
				type: "string",
				required: false,
				input: true,
			},
			phoneNumber: {
				type: "string",
				required: false,
				input: true,
			},
			universityName: {
				type: "string",
				required: false,
				input: true,
			},
			role: {
				type: "string",
				required: true,
				defaultValue: "USER" as UserRole,
				input: false,
			},
		},
	},

	emailAndPassword: {
		enabled: true,
	},
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
});
