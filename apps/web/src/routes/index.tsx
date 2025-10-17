import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	async loader({context}) {
		return {
			users: await context.orpc.user.getAll.call()
		}
	}
});

function HomeComponent() {

	const {users} = Route.useLoaderData()

	return <div className="flex flex-col gap-4 container">{JSON.stringify(users)}</div>;
}
