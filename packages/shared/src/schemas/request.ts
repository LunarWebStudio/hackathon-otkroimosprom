import z from "zod/v4";

export const RequestSchema = z.object({
	vacancyId: z.string(),
});
