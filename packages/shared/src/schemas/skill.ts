import z from "zod/v4";

export const SkillSchema = z.object({
	name: z
		.string({
			message: "Введите название",
		})
		.min(1, "Введите название"),
});
