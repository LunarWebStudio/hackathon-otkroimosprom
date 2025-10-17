import z from "zod/v4";
import { organizationRequestsStatus } from "@lunarweb/database/schema";

export const OrganizationSchema = z.object({
	name: z
		.string({
			message: "Введите название компании",
		})
		.min(1, "Введите название компании"),
	inn: z
		.string({
			message: "Введите ИНН компании",
		})
		.min(1, "Введите ИНН компании"),
	orgn: z
		.string({
			message: "Введите ОРГН/ОРГНИП",
		})
		.min(1, "Введите ОРГН/ОРГНИП"),
	kpp: z.string().nullish(),
	address: z.string().nullish(),
	lawAddress: z.string().nullish(),
	contacts: z.string().nullish(),
});

export const organizationRequestStatusSchema = z.enum(
	organizationRequestsStatus.enumValues,
);
