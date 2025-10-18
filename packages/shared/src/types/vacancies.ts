export const vacancyTypes = ["JOB", "INTERNSHIP"] as const;

export type VacancyType = (typeof vacancyTypes)[number];

export const vacancyTypeNames: Record<VacancyType, string> = {
	JOB: "Вакансия",
	INTERNSHIP: "Стажировка",
};

export const workFormatTypes = ["REMOTE", "OFFICE", "HYBRID"] as const;

export type WorkFormat = (typeof workFormatTypes)[number];

export const workFormatNames: Record<WorkFormat, string> = {
	REMOTE: "Удаленно",
	OFFICE: "Офис",
	HYBRID: "Гибрид",
};
