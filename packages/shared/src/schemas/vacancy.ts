import z from "zod";

export const VacancySchema = z.object({
	name: z.string().min(1),
	responsibilities: z.array(z.string().min(1)).min(1),
	requirements: z.array(z.string().min(1)).min(1),
	conditions: z.array(z.string().min(1)).min(1),
	skills: z.array(z.string().min(1)).min(1),
	companyId: z.string().min(1),
	address: z.string().min(1),
	workFormat: z.enum(["REMOTE", "OFFICE", "HYBRID"]),
	type: z.enum(["JOB", "INTERNSHIP"]),
	salaryFrom: z.number().int().optional().nullable(),
	salaryTo: z.number().int().optional().nullable(),
	expiresAt: z.coerce.date(),
	status: z.enum(["ACTIVE", "ARCHIVE"]).optional(),
	fileId: z.string().optional().nullable(),
});
