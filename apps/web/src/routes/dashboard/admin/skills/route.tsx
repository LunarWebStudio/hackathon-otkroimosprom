import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/skills")({
	beforeLoad: () => {
		return {
			crumbs: [
				{
					label: "Навыки",
					href: "/dashboard/skills/",
				},
			],
		}
	},
});
