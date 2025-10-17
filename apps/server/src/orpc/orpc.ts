import type { UserRole } from "@lunarweb/shared/types";
import { ORPCError, os } from "@orpc/server";
import type { ORPCContext } from "./context";

export const o = os.$context<ORPCContext>();

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

const errorLogger = o.middleware(async ({ context, next }) => {
	try {
		return await next({ context });
	} catch (error) {
		console.error(error);
		throw error;
	}
});

export const publicProcedure = o.use(errorLogger);

export const protectedProcedure = publicProcedure.use(requireAuth);

export const roleProcedure = (roles: UserRole[]) => {
	return protectedProcedure.use(async ({ context, next, path }) => {
		if (!roles.includes(context.session.user.role as UserRole)) {
			throw new ORPCError("FORBIDDEN", {
				message: `User has role: ${context.session.user.role} but ${roles.join(", ")} are required for ${path.join(".")}`,
			});
		}
		return next({
			context: {
				session: context.session,
			},
		});
	});
};
