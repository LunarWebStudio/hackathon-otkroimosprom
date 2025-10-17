import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";
import { resumeRouter } from "./resume";
import { skillsRouter } from "./skill";
import { specialitiesRouter } from "./speciality";
import { vacanciesRouter } from "./vacancy";
import { requestsRouter } from "./request";
import { responseRouter } from "./response";

export const appRouter = {
	user: userRouter,
	organizations: organizationRouter,
	resume: resumeRouter,
	skills: skillsRouter,
	specialties: specialitiesRouter,
	vacancies: vacanciesRouter,
	requests: requestsRouter,
	responses: responseRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = InferRouterOutputs<AppRouter>;
export type AppRouterInputs = InferRouterInputs<AppRouter>;
