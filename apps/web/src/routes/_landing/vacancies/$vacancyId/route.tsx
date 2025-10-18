import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/vacancies/$vacancyId")({
	async beforeLoad() {
		return {
			crumbs: [
				{
					label: "Вакансии",
					href: "/vacancies",
				},
			],
		}
	},
});
