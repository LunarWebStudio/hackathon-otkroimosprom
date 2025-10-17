import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { resumeRouter } from "./resume";
import { skillsRouter } from "./skill";

export const appRouter = {
	user: userRouter,
	organization: organizationRouter,
	resume: resumeRouter,
	skills: skillsRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = InferRouterOutputs<AppRouter>;
export type AppRouterInputs = InferRouterInputs<AppRouter>;
