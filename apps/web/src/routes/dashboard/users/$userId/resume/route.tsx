import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users/$userId/resume")({
	beforeLoad({ params }) {
		return {
			crumbs: [
				{
					label: "Резюме",
					href: `/dashboard/users/${params.userId}/resume`,
				},
			],
		};
	},
});
