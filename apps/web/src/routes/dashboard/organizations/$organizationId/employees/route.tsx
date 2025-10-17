import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId/employees",
)({
	beforeLoad: ({ params }) => {
		return {
			crumbs: [
				{
					label: "Пользователи",
					href: `/dashboard/organizations/${params.organizationId}/employees`,
				},
			],
		};
	},
});
