import { BreadcrumbDynamic } from "@/components/ui/breadcrumb";
import {
	Dashboard,
	DashboardContent,
	DashboardHeader,
	DashboardTitle,
	DashboardTitleText,
} from "@/components/ui/dashboard";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/organizations/$organizationId/",
)({
	component: RouteComponent,
	async loader({ context, params }) {
		const organization = await context.orpc.organizations.getOne.call({
			id: params.organizationId,
		});

		if (!organization) {
			throw notFound();
		}

		return {
			organization,
		};
	},
});

function RouteComponent() {
	const { organization } = Route.useLoaderData();

	return (
		<Dashboard>
			<DashboardHeader>
				<DashboardTitle hideNavigation>
					<DashboardTitleText>
						<BreadcrumbDynamic />
					</DashboardTitleText>
				</DashboardTitle>
			</DashboardHeader>
			<DashboardContent>{organization.name}</DashboardContent>
		</Dashboard>
	);
}
