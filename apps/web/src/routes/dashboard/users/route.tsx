import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users")({
	async beforeLoad() {
		return {
			crumbs: ["Мои резюме"],
		};
	},
});
