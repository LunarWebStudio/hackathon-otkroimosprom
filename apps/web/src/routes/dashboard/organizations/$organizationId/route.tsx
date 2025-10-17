import { orpc } from "@/utils/orpc";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId",
)({
	beforeLoad: async ({ params, context }) => {
		const organization = await orpc.organizations.getOne.call({
			id: params.organizationId,
		});

		if (!organization) {
			throw notFound();
		}

		return {
			crumbs: [
				...context.crumbs,
				{
					label: organization.name,
					href: `/dashboard/organizations/${organization.id}/`,
				},
			],
		};
	},
});
