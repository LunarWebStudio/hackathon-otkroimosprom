import { createFileRoute, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = useRouteContext({
		strict: false,
	});

	return <div>Hello, {session?.user.name}!</div>;
}
