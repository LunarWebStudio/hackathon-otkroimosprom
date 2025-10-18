import type { orpc } from "@/utils/orpc";

export type Vacancy = NonNullable<
	Awaited<ReturnType<typeof orpc.vacancies.getAll.call>>
>[number];
