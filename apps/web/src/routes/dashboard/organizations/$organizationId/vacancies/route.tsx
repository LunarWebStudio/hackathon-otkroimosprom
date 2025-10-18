import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId/vacancies",
)({
	beforeLoad: ({ params }) => {
		return {
			crumbs: [
				{
					label: "Вакансии",
					href: `/dashboard/organizations/${params.organizationId}/vacancies`,
				},
			],
		};
	},
});
