import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./-sidebar";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	async beforeLoad({ context, location }) {
		if (!context.session) {
			throw redirect({
				to: "/auth/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}

		return {
			crumbs: ["Личный кабинет"],
		};
	},
});

function RouteComponent() {
	return (
		<SidebarProvider className="max-w-screen overflow-hidden">
			<DashboardSidebar />
			<main className="overflow-hidden grow flex lg:p-0">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
