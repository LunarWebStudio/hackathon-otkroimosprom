import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users")({
	beforeLoad: () => {
		return {
			crumbs: [
				{
					label: "Пользователи",
					href: "/dashboard/users/",
				},
			],
		};
	},
});
