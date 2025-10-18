import z from "zod";

export const ResponseSchema = z.object({
	requestId: z.string(),
	text: z.string(),
	status: z.enum(["ACCEPTED", "REJECTED"]),
});
