import z from "zod/v4";

export const ResumeSchema = z.object({
	title: z.string().min(1, { message: "Название обязательно для заполнения" }),
	name: z
		.string()
		.min(3, { message: "Имя должно содержать не менее 3 символов" }),
	photoId: z.string().optional().nullable(),
	birthDate: z.date().optional().nullable(),
	gender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	email: z
		.string()
		.email({ message: "Введите корректный email" })
		.optional()
		.nullable(),
	skillIds: z
		.array(z.string())
		.min(1, { message: "Выберите хотя бы один навык" }),
	experience: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	fileId: z.string().optional().nullable(),
	citizenship: z.string().optional().nullable(),
	specialtyId: z.string().min(1, { message: "Выберите специальность" }),
	university: z.string().min(1, { message: "Выберите университет" }),
	educationLevel: z.enum([
		"PRIMARY",
		"BASIC",
		"SECONDARY",
		"VOCATIONAL_SECONDARY",
		"HIGHER",
	]),
});
