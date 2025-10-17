import { createFileRoute } from "@tanstack/react-router";
import CreateOrganizationForm from "./-create-organization-form";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return <CreateOrganizationForm />;
}
