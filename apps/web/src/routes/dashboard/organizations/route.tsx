import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/organizations")({
	beforeLoad: () => {
		return {
			crumbs: [
				{
					label: "Компании",
					href: "/dashboard/organizations/",
				},
			],
		};
	},
});
