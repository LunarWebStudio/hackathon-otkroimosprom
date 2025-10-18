import { vacancyTypes, workFormatTypes } from "@lunarweb/database/schema";
import z from "zod";

export const VacancyTypeSchema = z.enum(vacancyTypes.enumValues, {
	message: "Выберте тип вакансии",
});

export const WorkFormatSchema = z.enum(workFormatTypes.enumValues, {
	message: "Выберте формат работы",
});

export const VacancySchema = z.object({
	name: z
		.string({
			message: "Введите название вакансии",
		})
		.min(1, "Введите название вакансии"),
	responsibilities: z
		.string({
			message: "Введите обязанности",
		})
		.min(1, "Введите обязанности"),
	requirements: z
		.string({
			message: "Введите требования",
		})
		.min(1, "Введите требования"),
	conditions: z
		.string({
			message: "Введите условия",
		})
		.min(1, "Введите условия"),
	specialtyId: z
		.string({
			message: "Выберите специальность",
		})
		.min(1, "Выберите специальность"),
	skillIds: z.array(z.string().min(1)).min(1, "Выберите хотя бы 1 навык"),
	address: z
		.string({
			message: "Введите адрес",
		})
		.min(1, "Введите адрес"),
	workFormat: WorkFormatSchema,
	type: VacancyTypeSchema,
	salaryFrom: z.coerce
		.number({
			message: "Введите зп от",
		})
		.int({
			message: "Введите зп от",
		})
		.nullish(),
	salaryTo: z.coerce
		.number({
			message: "Введите зп до",
		})
		.int({
			message: "Введите зп до",
		})
		.nullish(),
	expiresAt: z.date({
		message: "Выберите дату окончания",
	}),
});
