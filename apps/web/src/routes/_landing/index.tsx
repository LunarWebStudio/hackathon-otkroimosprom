import { createFileRoute } from "@tanstack/react-router";
import { Header } from "./-header";

export const Route = createFileRoute("/_landing/")({
	component: RouteComponent,
	async loader({ context }) {
		return {
			// vacancies: await context.orpc.vacancies.getAll.call(),
			user: context.session?.user,
		};
	},
});

function RouteComponent() {
	return (
		<div className=" container">
			<div></div>
		</div>
	);
}
