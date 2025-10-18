import z from "zod/v4";

export const RequestSchema = z.object({
	vacancyId: z.string().nullable().optional(),
	resumeId: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
});
