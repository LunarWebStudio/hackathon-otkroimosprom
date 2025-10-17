import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	beforeLoad: ({ context }) => {
		if (context?.session?.user.role === "ADMIN") {
			throw redirect({
				to: "/dashboard/admin/users",
			});
		}
	},
});
