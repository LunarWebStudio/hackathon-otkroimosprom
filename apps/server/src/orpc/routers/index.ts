import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { resumeRouter } from "./resume";
import { skillsRouter } from "./skill";
import { specialitiesRouter } from "./speciality";

export const appRouter = {
	users: userRouter,
	organizations: organizationRouter,
	resume: resumeRouter,
	skills: skillsRouter,
	specialties: specialitiesRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = InferRouterOutputs<AppRouter>;
export type AppRouterInputs = InferRouterInputs<AppRouter>;
