import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId",
)({
	async beforeLoad({ context, params }) {
		if (context.session?.user?.organizationId !== params.organizationId) {
			throw notFound();
		}

		return {
			crumbs: ["Компания"],
		};
	},
});
