import z from "zod/v4";

export const ResumeSchema = z.object({
	title: z.string().min(1),
	photoId: z.string().optional().nullable(),
	birthDate: z.date().optional().nullable(),
	gender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	email: z.string().email().optional().nullable(),
	skillIds: z.array(z.string()).min(1),
	experience: z.string().optional().nullable(),
	courses: z.array(z.string()).min(1),
	description: z.string().optional().nullable(),
	fileId: z.string().optional().nullable(),
	citizenship: z.string().optional().nullable(),
	specialtyId: z.string().optional().nullable(),
});