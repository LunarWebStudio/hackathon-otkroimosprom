import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "./-header";
import { Provider } from "@radix-ui/react-tooltip";

export const Route = createFileRoute("/_landing")({
	component: RouteComponent,
	beforeLoad({ params }) {
		return {
			crumbs: [
				{
					label: "Главная",
					href: "/",
				},
			],
		};
	},
});

function RouteComponent() {
	return (
		<div className="max-w-screen overflow-x-hidden lg:p-0">
			<Header />
			<main className="mt-15">
				<Outlet />
			</main>
		</div>
	);
}
