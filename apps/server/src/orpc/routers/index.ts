import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { resumeRouter } from "./resume";

export const appRouter = {
	user: userRouter,
	organization: organizationRouter,
	resume: resumeRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = InferRouterOutputs<AppRouter>;
export type AppRouterInputs = InferRouterInputs<AppRouter>;
