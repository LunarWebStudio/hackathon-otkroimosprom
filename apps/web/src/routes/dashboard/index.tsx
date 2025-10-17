import type { UserRole } from "@lunarweb/shared/types";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	beforeLoad: ({ context }) => {
		if (context?.session?.user.role === "ADMIN") {
			throw redirect({
				to: "/dashboard/admin/users",
			});
		}

		if (
			(["COMPANY_MANAGER", "HR"] as UserRole[]).includes(
				context?.session?.user.role ?? "USER",
			)
		) {
			throw redirect({
				to: "/dashboard/organizations/$organizationId/vacancies",
				params: {
					organizationId: context?.session?.user.organizationId!,
				},
			});
		}
	},
});
